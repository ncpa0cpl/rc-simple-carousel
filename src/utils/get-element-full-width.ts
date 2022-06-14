export const getElementFullWidth = (element: Element) => {
  const computedStyle = getComputedStyle(element);

  const styleToNumber = (v: string) => Number(v.replace(/[^0-9.]/g, ""));

  return (
    element.clientWidth +
    styleToNumber(computedStyle.marginLeft) +
    styleToNumber(computedStyle.marginRight)
  );
};
