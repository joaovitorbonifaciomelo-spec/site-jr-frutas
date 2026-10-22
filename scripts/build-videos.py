#!/usr/bin/env python3
"""
Pipeline versionado dos vídeos do site (public/video/**) — sempre a partir dos
ORIGINAIS DE CÂMERA (iPhone, HEVC 10-bit HLG, 1080×1920 vertical) em
"<Grupo JR>/5 - Materiais/...". Nunca reencoda os MP4 já comprimidos do site
nem os reels editados (têm texto/logo queimados).

Para cada receita:
1. monta um MASTER intermediário 1080×1920 (tone-map HLG → SDR BT.709 feito UMA
   vez, crossfades entre clipes, CRF 14) numa pasta temporária;
2. gera as versões publicadas a partir do master:
     <nome>-1080.mp4  1080×1920  (versão alta)
     <nome>-720.mp4    720×1280  (versão leve)
   H.264 High · yuv420p · +faststart · sem áudio · 30 fps · tags BT.709;
3. gera os posters do 1º quadro: <poster>-1080.webp e <poster>-720.webp.

Versões horizontais (1280×720 / 1920×1080) só existem quando há ORIGINAL
horizontal — hoje não há material horizontal utilizável para os heros (ver
docs/visual-review/video-inventory.csv). Os heros horizontais atuais
(hero-wide.mp4, empresas/jr-coco-wide.mp4) são PLACEHOLDERS pendentes de nova
gravação e não são gerados aqui.

Uso:
    python scripts/build-videos.py              # todas as receitas
    python scripts/build-videos.py jr-coco      # só as indicadas
    python scripts/build-videos.py --check      # só confere as fontes
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import NamedTuple

SITE = Path(__file__).resolve().parents[1]  # .../2 - Site/JR FRUTAS
GRUPO = Path(os.environ.get("GRUPO_JR_ROOT") or "G:/Meu Drive/Bonifácio/Clientes/Branding/1 - Grupo JR")  # originais (5 - Materiais)
MAT = GRUPO / "5 - Materiais"
OUT = SITE / "public" / "video"

XFADE = 0.6  # s de crossfade entre clipes

# HLG (BT.2020) → SDR BT.709 com tone-map hable (mesma cadeia já validada no projeto)
TONEMAP = (
    "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,"
    "tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"
)
BT709 = ["-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709"]

# versões publicadas: (sufixo, largura, altura, crf, maxrate, bufsize, level)
LADDER = [
    ("1080", 1080, 1920, 23, "4500k", "9000k", "4.1"),
    ("720", 720, 1280, 25, "1800k", "3600k", "4.0"),
]
# fundos longos (14–18 s) com overlay escuro/glass por cima: mesma resolução, bitrate menor
BACKGROUND_LADDER = [
    ("1080", 1080, 1920, 25, "3200k", "6400k", "4.1"),
    ("720", 720, 1280, 27, "1300k", "2600k", "4.0"),
]


def ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg  # type: ignore

    return imageio_ffmpeg.get_ffmpeg_exe()


FF = ffmpeg()


class Clip(NamedTuple):
    path: Path
    start: float
    duration: float


class Recipe(NamedTuple):
    name: str  # base do arquivo publicado (ex.: "empresas/jr-coco")
    poster: str  # base do poster (ex.: "empresas/jr-coco-poster")
    clips: list[Clip]
    ladder: list | None = None  # escada própria (fundos longos sob overlay/glass)


def M(*parts: str) -> Path:
    return MAT.joinpath(*parts)


def C(path: Path, start: float, duration: float) -> Clip:
    return Clip(path, start, duration)


# ---------------------------------------------------------------------------
# RECEITAS — origem documentada de cada vídeo publicado
# ---------------------------------------------------------------------------
JR_COCO = M("Jr Coco", "Utilizado")
BELA = M("Bela fruta", "Utilizado")
FF_ = M("Fruta Forte", "Utilizados")

RECIPES: dict[str, Recipe] = {
    # Capítulo JR COCO (Nossas Empresas) + hero JR COCO no mobile:
    # gaiolas → fachada do galpão JR COCO (IMG_7887 saiu: câmera de cima em movimento brusco, parecia vídeo com defeito)
    "jr-coco": Recipe("empresas/jr-coco", "empresas/jr-coco-poster", [
        C(JR_COCO / "IMG_7876.MOV", 1.0, 4.2),
        C(JR_COCO / "IMG_7856.MOV", 0.5, 3.8),
    ]),
    # Capítulo e hero Bela Fruta: box no CEASA-GO → carga
    "bela-fruta": Recipe("empresas/bela-fruta", "empresas/bela-fruta-poster", [
        C(BELA / "Estrutura" / "IMG_5866.MOV", 2.6, 4.3),
        C(BELA / "Processo" / "IMG_5884.MOV", 2.0, 4.3),
    ]),
    # Capítulo e hero FRUTAFORTE: lavoura do produtor parceiro → João Francisco e Marcelo
    "frutaforte": Recipe("empresas/frutaforte", "empresas/frutaforte-poster", [
        C(FF_ / "IMG_7933.MOV", 5.0, 3.5),
        C(FF_ / "IMG_7969.MOV", 2.0, 4.0),
    ]),
    # Hero principal (mobile) — MESMO vídeo de antes, só reencodado do original.
    # PENDENTE DE NOVA GRAVAÇÃO/DIREÇÃO (não escolher outro aqui).
    "hero-mobile": Recipe("hero-mobile", "hero-mobile-poster", [
        C(JR_COCO / "IMG_7861.MOV", 9.0, 4.0),
        C(JR_COCO / "IMG_7876.MOV", 8.0, 4.0),
        C(BELA / "IMG_7907.MOV", 2.0, 4.0),
        C(JR_COCO / "IMG_7865.MOV", 9.0, 4.0),
    ], BACKGROUND_LADDER),
    # Fundo do hub /links — mesmo corte de antes, reencodado do original
    "links": Recipe("links-loop", "links-poster", [
        C(BELA / "IMG_7907.MOV", 2.0, 4.0),
        C(JR_COCO / "IMG_7876.MOV", 8.0, 4.0),
        C(JR_COCO / "IMG_7865.MOV", 9.0, 4.0),
        C(BELA / "IMG_7906.MOV", 18.0, 4.0),
        C(JR_COCO / "IMG_7861.MOV", 9.0, 4.0),
    ], BACKGROUND_LADDER),
}


def duration_of(path: Path) -> float:
    err = subprocess.run([FF, "-hide_banner", "-i", str(path)], capture_output=True, text=True, errors="replace").stderr
    m = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", err)
    if not m:
        raise RuntimeError(f"sem duração: {path}")
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def check(recipe: Recipe) -> None:
    for c in recipe.clips:
        if not c.path.exists():
            raise FileNotFoundError(c.path)
        real = duration_of(c.path)
        if c.start + c.duration > real - 0.05:
            raise ValueError(f"{c.path.name}: pede até {c.start + c.duration:.2f}s, arquivo tem {real:.2f}s")


def run(args: list[str]) -> None:
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def build(key: str, recipe: Recipe, tmp: Path) -> None:
    check(recipe)
    inputs: list[str] = []
    fc: list[str] = []
    for i, c in enumerate(recipe.clips):
        inputs += ["-ss", f"{c.start:.2f}", "-t", f"{c.duration:.2f}", "-i", str(c.path)]
        # o ffmpeg aplica a rotação do iPhone na decodificação → quadro já em pé (1080×1920)
        fc.append(f"[{i}:v]setpts=PTS-STARTPTS,fps=30,{TONEMAP},scale=1080:1920:flags=lanczos,setsar=1[v{i}]")
    prev, offset = "v0", 0.0
    for i in range(1, len(recipe.clips)):
        offset += recipe.clips[i - 1].duration - XFADE
        out = f"x{i}" if i < len(recipe.clips) - 1 else "vx"
        fc.append(f"[{prev}][v{i}]xfade=transition=fade:duration={XFADE}:offset={offset:.2f}[{out}]")
        prev = out
    last = "vx" if len(recipe.clips) > 1 else "v0"

    master = tmp / f"{key}-master.mp4"
    run([*inputs, "-filter_complex", ";".join(fc), "-map", f"[{last}]", "-an",
         "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", *BT709, str(master)])

    for suffix, w, h, crf, maxrate, bufsize, level in recipe.ladder or LADDER:
        dest = OUT / f"{recipe.name}-{suffix}.mp4"
        dest.parent.mkdir(parents=True, exist_ok=True)
        # -display_rotation 0: os quadros do master JÁ estão em pé, mas o MP4 herda a matriz de rotação
        # do iPhone (displaymatrix); zerar evita que o vídeo publicado saia deitado no navegador.
        run(["-display_rotation", "0", "-i", str(master), "-vf", f"scale={w}:{h}:flags=lanczos,setsar=1,format=yuv420p", "-an",
             "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-level", level,
             "-crf", str(crf), "-maxrate", maxrate, "-bufsize", bufsize, "-g", "60", "-keyint_min", "30",
             "-pix_fmt", "yuv420p", *BT709, "-movflags", "+faststart", str(dest)])
        poster = OUT / f"{recipe.poster}-{suffix}.webp"
        run(["-i", str(dest), "-frames:v", "1", "-c:v", "libwebp", "-quality", "68", str(poster)])
        print(f"{dest.relative_to(OUT)!s:34s} {dest.stat().st_size / 1024:7.0f} KB   poster {poster.stat().st_size / 1024:4.0f} KB")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("which", nargs="*", help="receitas (padrão: todas): " + ", ".join(RECIPES))
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    keys = a.which or list(RECIPES)
    with tempfile.TemporaryDirectory() as t:
        for k in keys:
            if a.check:
                check(RECIPES[k])
                print(f"{k}: fontes OK")
            else:
                build(k, RECIPES[k], Path(t))


if __name__ == "__main__":
    main()
