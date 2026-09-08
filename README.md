# Чёрно-белые split-face портреты

Коллажи из двух лиц: левая половина — один человек, правая — другой. Черты не усредняются и не смешиваются: каждый пиксель принадлежит только одному человеку.

## Итоги

- Женщина + молодой человек: [`output/split-face-portrait-bw.png`](output/split-face-portrait-bw.png)
- Два мужчины (слева старший, справа младший с бородой): [`output/two-men-split-face-bw.png`](output/two-men-split-face-bw.png)
- Две девушки с исходного фото (слева кружевная блузка и карие/ореховые глаза, справа голубые глаза и жемчуг у век): [`output/two-women-split-face-bw.png`](output/two-women-split-face-bw.png)

Этот коллаж собран из реальных кропов исходника, без генерации чужих лиц.

## Что внутри

- `assets/` — исходные цветные фотографии
- `portraits/` — чёрно-белые анфас-портреты с нейтральным выражением
- `scripts/compose_split_face.py` — выравнивание по глазам и губам и жёсткий вертикальный стык по центру
- `models/face_landmarker.task` — модель MediaPipe Face Landmarker

## Как собрать заново

Нужны Python 3.10+ и системная библиотека `libegl1` (MediaPipe).

```bash
sudo apt-get install -y libegl1
pip install -r requirements.txt

python3 scripts/compose_split_face.py \
  --left portraits/left-woman-isolated.jpg \
  --right portraits/right-woman-isolated.jpg \
  --model models/face_landmarker.task \
  --out output/two-women-split-face-bw.png
```

Скрипт ставит оба лица в одну систему координат (линия глаз и центр губ), затем берёт левую половину первого кадра и правую половину второго. Линия стыка проходит через середину лба, носа, губ и подбородка.
