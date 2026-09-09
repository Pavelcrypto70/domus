export type RenderItem = {
  src: string;
  title: string;
  caption: string;
  isSketch?: boolean;
};

export const RENDERS: RenderItem[] = [
  {
    src: "/renders/house-dusk-hero.png",
    title: "Сумерки",
    caption: "L-дом: дерево слева, графит справа, бетон, LED по периметру и очаг",
  },
  {
    src: "/renders/house-terrace-night.png",
    title: "Терраса",
    caption: "Приподнятая площадка, подсветка карниза и периметра, костровище",
  },
  {
    src: "/renders/house-sketch-angle.png",
    title: "Двор",
    caption: "Тот же объём с внутреннего угла, бра и тёплое остекление",
  },
  {
    src: "/renders/house-side-dusk.png",
    title: "Боковой фасад",
    caption: "Графитовые панели, светлый бетон, бра вверх-вниз",
  },
  {
    src: "/renders/house-daylight.png",
    title: "День",
    caption: "Горизонтальное дерево, графит и бетон при дневном свете",
  },
];

export const SKETCH: RenderItem = {
  src: "/renders/sketch.png",
  title: "Исходный эскиз",
  caption: "Линейный объём, с которого собраны рендеры и 3D-модель",
  isSketch: true,
};
