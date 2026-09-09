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
    caption: "Главный ракурс: графит, дерево и светлый бетон, LED по периметру террасы",
  },
  {
    src: "/renders/house-sketch-angle.png",
    title: "Ракурс эскиза",
    caption: "Тот же трёхчетвертной вид, что на исходном линейном эскизе",
  },
  {
    src: "/renders/house-terrace-night.png",
    title: "Терраса",
    caption: "Крупный план входа и непрерывной подсветки по краю площадки",
  },
  {
    src: "/renders/house-side-dusk.png",
    title: "Боковой фасад",
    caption: "Узкие вертикальные окна, деревянный софит и тёплое внутреннее свечение",
  },
  {
    src: "/renders/house-daylight.png",
    title: "День",
    caption: "Материалы фасада при дневном свете: бетон, графитовый пояс кровли, дерево",
  },
];

export const SKETCH: RenderItem = {
  src: "/renders/sketch.png",
  title: "Исходный эскиз",
  caption: "Линейный объём, с которого собраны рендеры и 3D-модель",
  isSketch: true,
};
