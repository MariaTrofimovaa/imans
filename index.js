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
  document.querySelector('.form').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    // Дополнительные действия после отправки формы
    // Например, можно выполнить асинхронный запрос на сервер или изменить содержимое страницы
  });
  let popup = document.querySelector(".popup_menu-gratitude");
  let overlay = document.querySelector(".overlay");
  popup.style.display = "block";
  overlay.style.display = "block";
  closePopup();
}

function gratitudeClosePopup() {
  let popup = document.querySelector(".popup_menu-gratitude");
  // let overlay = document.querySelector(".overlay");
  popup.style.display = "none";
  // overlay.style.display = "none";
  overlayClose()
}