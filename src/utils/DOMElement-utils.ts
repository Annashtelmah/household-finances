import type { CategorysType} from "../types/categoty.type";

export class DOMElementUtils {
  public static createCardCategoty(id:string, title:string, containerElement:HTMLElement,type:CategorysType):void {
    const colDiv:HTMLElement = document.createElement("div");
    colDiv.classList.add("col");

    const cardDiv:HTMLElement = document.createElement("div");
    cardDiv.classList.add("card", "rounded-3");

    const bodyDiv:HTMLElement = document.createElement("div");
    bodyDiv.classList.add("card-body");

    const titleDiv:HTMLElement = document.createElement("div");
    titleDiv.classList.add(
      "card-title",
      "mb-2",
      "mt-1",
      "fs-3",
      "text",
      "fw-medium",
    );
    titleDiv.textContent = title;

    const flexDiv:HTMLElement = document.createElement("div");
    flexDiv.classList.add("d-flex", "mb-1", "align-items-center");

    const editButton:HTMLAnchorElement = document.createElement("a");
    editButton.href = "#/"+type+"/edit?id=" + id;
    editButton.classList.add(
      "btn",
      "btn-lg",
      "btn-primary",
      "fs-14",
    );
    editButton.textContent = "Редактировать";

    const deleteButton:HTMLElement = document.createElement("a");
    deleteButton.classList.add("btn", "btn-lg", "btn-danger", "ms-2", "fs-14","btn-delete");
    deleteButton.setAttribute("data-id",id);
    deleteButton.dataset.bsToggle = "modal";
    deleteButton.dataset.bsTarget = "#exampleModal";
    deleteButton.textContent = "Удалить";

    flexDiv.appendChild(editButton);
    flexDiv.appendChild(deleteButton);

    bodyDiv.appendChild(titleDiv);
    bodyDiv.appendChild(flexDiv);

    cardDiv.appendChild(bodyDiv);
    colDiv.appendChild(cardDiv);

    containerElement.appendChild(colDiv);
  }

  public static createEmptyCard(containerElement:HTMLElement,type:CategorysType) {
    const colDiv:HTMLElement = document.createElement("div");
    colDiv.classList.add("col");

    const cardDiv:HTMLElement = document.createElement("div");
    cardDiv.classList.add("card", "rounded-3", "h-100");

    const bodyDiv:HTMLElement = document.createElement("div");
    bodyDiv.classList.add("card-body");

    const createButton:HTMLAnchorElement = document.createElement("a");

    createButton.href = "#/"+type+"/create";
    createButton.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center",
      "w-100",
      "h-100",
    );

    const icon:HTMLElement = document.createElement("i");
    icon.classList.add("bi", "bi-plus-lg", "text-black-50");
    createButton.appendChild(icon);
    bodyDiv.appendChild(createButton);
    cardDiv.appendChild(bodyDiv);
    colDiv.appendChild(cardDiv);
    containerElement.appendChild(colDiv);
  }
}
