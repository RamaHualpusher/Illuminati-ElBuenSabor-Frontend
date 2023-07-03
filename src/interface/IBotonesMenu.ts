export interface IBotonMenu {
  value: string;
  label: string;
  icon: string;
}

export interface IBotonesMenuProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
