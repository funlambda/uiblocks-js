export type View<Model> = (model: Model) => React$Element

export function toClickHandler(handler: () => void): ((ce: any) => bool) {
  return ce => {
    ce.preventDefault();
    ce.stopPropagation();
    handler();
    return false;
  };
}
