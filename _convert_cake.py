from pathlib import Path
from PIL import Image

folder = Path("img/cake")
for f in folder.glob("*.webp"):
    img = Image.open(f).convert("RGB")
    out = f.with_suffix(".png")
    img.save(out, "PNG")
    print(out)