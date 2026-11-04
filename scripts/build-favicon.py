"""Gera os ícones do site a partir dos PNGs 512x512 em docs/brand/.

Aba do navegador: só o símbolo, sem fundo, preto em tema claro e branco em tema escuro.
Tela inicial (iPhone/Android): símbolo branco sobre preto, porque ali o sistema
preenche a transparência e um ícone sem fundo pode sumir.
Uso: python scripts/build-favicon.py (requer Pillow).
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BRAND_SRC = ROOT / "docs" / "brand"
PUBLIC = ROOT / "public"


def load(name: str) -> Image.Image:
    image = Image.open(BRAND_SRC / name).convert("RGBA")
    if image.size != (512, 512):
        raise SystemExit(f"{name} precisa ter 512x512, veio {image.size}")
    return image


def sized(image: Image.Image, px: int) -> Image.Image:
    return image if image.width == px else image.resize((px, px), Image.LANCZOS)


white = load("favicon-branco-512.png")
black = load("favicon-preto-512.png")

for px in (16, 32):
    sized(black, px).save(PUBLIC / f"favicon-preto-{px}.png", optimize=True)
    sized(white, px).save(PUBLIC / f"favicon-branco-{px}.png", optimize=True)

sized(black, 48).save(
    PUBLIC / "favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[sized(black, 16), sized(black, 32)],
)

tile = Image.alpha_composite(Image.new("RGBA", white.size, (0, 0, 0, 255)), white).convert("RGB")
for path, px in (
    (PUBLIC / "apple-touch-icon.png", 180),
    (PUBLIC / "brand" / "icon-192.png", 192),
    (PUBLIC / "brand" / "icon-512.png", 512),
):
    sized(tile, px).save(path, optimize=True)
