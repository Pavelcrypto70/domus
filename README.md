# Дом L — визуализация

Современный одноэтажный дом по линейному эскизу. Фасад: **графит**, **дерево**, **светлый бетон**. По периметру террасы — тёплая LED-подсветка.

В проекте две части:

- фотореалистичные ракурсы в `public/renders/`
- интерактивная 3D-модель того же L-объёма (вращение, день / ночь)

## Как запустить

Нужны Node.js 20+ и npm.

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 43141
```

Откройте [http://127.0.0.1:43141](http://127.0.0.1:43141).

Сборка:

```bash
npm run build
npm start -- --hostname 127.0.0.1 --port 43141
```

## Что внутри

- `public/renders/sketch.png` — исходный эскиз
- `public/renders/house-sketch-angle.png` — рендер с того же ракурса
- `public/renders/house-dusk-hero.png` — сумерки, главный кадр
- `public/renders/house-terrace-night.png` — крупный план террасы
- `public/renders/house-side-dusk.png` — боковой фасад
- `public/renders/house-daylight.png` — дневной свет
- `components/house-model.tsx` — геометрия L-дома

В 3D-сцене ночной режим включён сразу, чтобы была видна линия подсветки по краю террасы.
