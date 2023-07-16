document.addEventListener("DOMContentLoaded", () => {
  /*
   * Multilingual dropdown list
   */

  $(document).ready(function () {
    $("a.dropdown-a").on("click", function (e) {
      e.preventDefault();
    });
    $(".dropdown-li").hover(
      function () {
        clearTimeout($.data(this, "timer"));
        $("ul, .disabled_langs", this).stop(true, true).slideDown(200);
      },
      function () {
        $.data(
          this,
          "timer",
          setTimeout(
            $.proxy(function () {
              $("ul, .disabled_langs, .disabled_langs_mob", this)
                .stop(true, true)
                .slideUp(200);
            }, this),
            100
          )
        );
      }
    );
  });

  /*
   * Video for mobile version
   */
  const windowInnerWidth = window.innerWidth;

  if (windowInnerWidth <= 475) {
    let movie = document.querySelector("video");
    // change "#" to video path
    movie.setAttribute("src", "https://imans.io/background-video_mob.mp4");
    document.querySelector("video").play();
  }
});

/*
 * Set preloader
 */

setTimeout(function () {
  let preloader = document.querySelector(".preloader");
  preloader.classList.add("hide");
}, 2000);

function checkScreenWidth() {
  const screenWidth = window.innerWidth;
  const dropdownLang = document.querySelector(".dropdown-lang");
  const logoLangBlock = document.querySelector(".logo-block");
  const langBlock = document.querySelector(".lang_block");

  if (screenWidth <= 680) {
    if (!logoLangBlock.contains(dropdownLang)) {
      logoLangBlock.appendChild(dropdownLang);
      dropdownLang.classList.add("lang_block");
    }
  } else {
    if (!langBlock.contains(dropdownLang)) {
      langBlock.appendChild(dropdownLang);
    }
  }
}

window.addEventListener("DOMContentLoaded", checkScreenWidth);
window.addEventListener("resize", checkScreenWidth);

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

function handleSubmit(event, url) {
  event.preventDefault();

  const submitButton = document.querySelector(".download-modal-btn");
  submitButton.disabled = true;
  const form = document.forms.myForm;

  const hostname = new URL(url).hostname;

  let formData = {};
  let formFields = document.getElementsByTagName("input");

  for (let i = 0; i < formFields.length; i++) {
    let fieldName = formFields[i].name;
    let fieldValue = formFields[i].value;

    formData[fieldName] = fieldValue;
  }

  formData["source"] = hostname;
  formData["url"] = url;

  axios
    .post("/api/v1/client", formData)
    .then((response) => {
      console.log("Данные формы успешно отправлены на сервер");
      gratitudePopupShow();
      form.reset();
    })
    .catch((error) => {
      console.error("Ошибка при отправке данных формы:", error.message);
    })
    .finally(() => {
      submitButton.disabled = false;
    });

  return false;
}

function changeLanguage(event, lang) {
  event.preventDefault();
  const hostname = window.location.hostname;
  const port = window.location.port;
  const newUrl = `https://${hostname}:${port}/${lang}`;
  window.location.href = newUrl;
}

const copyEmails = document.querySelectorAll(".copy-email");
copyEmails.forEach((element) => {
  element.addEventListener("mouseenter", handleEmailMouseEnter);
  element.addEventListener("mouseleave", handleEmailMouseLeave);
});

function handleEmailMouseEnter(event) {
  const email = event.target.dataset.email;
  event.target.addEventListener("click", () => {
    copyToClipboard(email, event.target);
  });
  event.target.style.cursor = "pointer";
}

function handleEmailMouseLeave(event) {
  event.target.removeEventListener("click", copyToClipboard);
  event.target.style.cursor = "auto";
}

function copyToClipboard(text, element) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  const notification = document.createElement("span");
  notification.classList.add("copy-notification");
  notification.textContent = "Copied";
  element.parentNode.insertBefore(notification, element.nextSibling);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}
