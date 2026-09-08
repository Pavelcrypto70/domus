# Чёрно-белый split-face портрет

Коллаж из двух фотографий: левая половина лица — женщина, правая — молодой человек. Черты не усредняются и не смешиваются: каждый пиксель принадлежит только одному человеку.

Итоговый файл: [`output/split-face-portrait-bw.png`](output/split-face-portrait-bw.png)

## Что внутри

- `assets/` — исходные цветные фотографии
- `portraits/` — чёрно-белые анфас-портреты с нейтральным выражением, снятые по исходникам
- `scripts/compose_split_face.py` — выравнивание по глазам и губам и жёсткий вертикальный стык по центру
- `models/face_landmarker.task` — модель MediaPipe Face Landmarker для точек лица

## Как собрать заново

Нужны Python 3.10+ и системная библиотека `libegl1` (MediaPipe).

```bash
sudo apt-get install -y libegl1
pip install -r requirements.txt

python3 scripts/compose_split_face.py \
  --woman portraits/woman-frontal-bw.png \
  --man portraits/man-frontal-bw.png \
  --model models/face_landmarker.task \
  --out output/split-face-portrait-bw.png
```

Скрипт ставит оба лица в одну систему координат (линия глаз и центр губ), затем берёт левую половину женского кадра и правую половину мужского. Линия стыка проходит через середину лба, носа, губ и подбородка.
