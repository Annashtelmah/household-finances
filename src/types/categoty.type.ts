export type CategoryType = "income" | "expense";
export type CategorysType = "income" | "expenses";

export type RequestCategoryType = {
  title: string;
};

export type ResponseCategoryType = {
  id: number;
  title: string;
};

export type CategoryTranslateType = {
  type: string;
  class: string;
};
