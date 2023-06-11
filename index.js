function popupShow() {
  let popup = document.querySelector(".popup_menu");
  let overlay = document.querySelector(".overlay");
  popup.style.display = "block";
  overlay.style.display = "block";
}

function closePopup() {
  let popup = document.querySelector(".popup_menu");
  let overlay = document.querySelector(".overlay");
  popup.style.display = "none";
  overlay.style.display = "none";
}

function overlayClose() {
  let popup = document.querySelector(".popup_menu");
  let popupG = document.querySelector(".popup_menu-gratitude");
  let overlay = document.querySelector(".overlay");
  popup.style.display = "none";
  popupG.style.display = "none";
  overlay.style.display = "none";
}

function gratitudePopupShow() {
  closePopup();
  let popup = document.querySelector(".popup_menu-gratitude");
  let overlay = document.querySelector(".overlay");
  popup.style.display = "block";
  overlay.style.display = "block";
}

function gratitudeClosePopup() {
  let popup = document.querySelector(".popup_menu-gratitude");
  popup.style.display = "none";
  overlayClose();
}

function handleSubmit(event) {
  event.preventDefault();

  let formData = {};
  let formFields = document.getElementsByTagName("input");

  for (let i = 0; i < formFields.length; i++) {
    let fieldName = formFields[i].name;
    let fieldValue = formFields[i].value;

    formData[fieldName] = fieldValue;
  }

  axios
    .post("http://localhost:8080/api/v1/client", formData)
    .then((response) => {
      console.log("Данные формы успешно отправлены на сервер");
      gratitudePopupShow();
    })
    .catch((error) => {
      console.error("Ошибка при отправке данных формы:", error.message);
    });

  return false;
}
