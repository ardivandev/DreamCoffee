const menuContainer = document.querySelector('.menu-container');
const formSearch = document.querySelector('#menu form');
const inputSearch = document.querySelector('#menu form input');
const blogSlider = document.getElementById('blogSlider');
const sliderWrapper = document.querySelector('.slider-wrapper');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let masterMenuData = [];
let currentIndex = 0;
let totalItems = 0;

async function initBlogSlider() {
  try {
    const res = await fetch('/data/blog.json');
    const blogData = await res.json();
    if (!blogData) return;

    totalItems = blogData.length;
    blogSlider.innerHTML = '';

    blogData.forEach((item) => {
      const card = document.createElement('div');
      card.setAttribute('class', 'item-blog');
      card.innerHTML = `
        <div class="card h-100 border shadow-sm p-3 rounded-4">
          <img src="${item.img}" class="card-img-top rounded-3" alt="${item.judul}" style="height:180px; object-fit:cover;">
          <div class="card-body px-0 pb-0">
            <h5 class="card-title fw-bold small">${item.judul}</h5>
            <p class="card-text text-muted extra-small">${item.description}</p>
            <a href="#" class="btn btn-link text-decoration-none p-0 fw-semibold" style="color: #c08552">Baca Selengkapnya →</a>
          </div>
        </div>
      `;
      blogSlider.appendChild(card);
    });

    updateSliderPosition();
  } catch (error) {
    console.log('Gagal memuat slider blog:', error);
  }
}

function getVisibleBlogItemsCount() {
  const cards = document.querySelectorAll('.item-blog');
  if (!cards.length || !sliderWrapper) return 1;

  const cardWidth = cards[0].clientWidth + 15;
  if (cardWidth <= 0) return 1;

  return Math.max(1, Math.floor(sliderWrapper.clientWidth / cardWidth));
}

function getMaxBlogIndex() {
  const visibleCount = getVisibleBlogItemsCount();
  return Math.max(0, totalItems - visibleCount);
}

function updateBlogButtons(maxIndex) {
  if (!prevBtn || !nextBtn) return;
  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= maxIndex;
}

function updateSliderPosition() {
  const cards = document.querySelectorAll('.item-blog');
  if (!cards.length || !sliderWrapper) return;

  const cardWidth = cards[0].clientWidth + 15;
  const maxIndex = getMaxBlogIndex();
  currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);
  blogSlider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  updateBlogButtons(maxIndex);
}

nextBtn.addEventListener('click', () => {
  const maxIndex = getMaxBlogIndex();
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateSliderPosition();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSliderPosition();
  }
});

window.addEventListener('resize', updateSliderPosition);

// Mengambil Menu
const getMenu = async () => {
  try {
    const res = await fetch('/data/menu.json');
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error', error.message);
    return null;
  }
};

// Membuat Menu Item Html
const createMenuItemHtml = (item) => {
  let div = document.createElement('div');
  div.setAttribute('class', 'item');
  div.innerHTML = `
    <img src="${item.img}" alt="${item.nama}" />
    <p>${item.nama}</p>
    <p>Rp.${item.harga.toLocaleString('id-ID')}</p>
    <form action="">
      <select class="form-select mb-3" aria-label="Select the order amount ">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
      </select>
      <input type="hidden" name="menuId" value="${item.id}" />
      <button type="button" class="btn btn-custom">Add To Cart</button>
    </form>
  `;
  return div;
};

// Render Menu Ke Html
const renderMenuToHtml = (menuList) => {
  menuContainer.innerHTML = '';

  if (menuList.length === 0) {
    menuContainer.innerHTML = `<p class="text-muted text-center w-100">Menu tidak ditemukan.</p>`;
    return;
  }

  menuList.forEach((item) => {
    const menuDiv = createMenuItemHtml(item);
    menuContainer.appendChild(menuDiv);
  });
};

// Init App
async function initApp() {
  const data = await getMenu();
  if (data) {
    masterMenuData = data;
    renderMenuToHtml(masterMenuData);
  }
}

// Search
if (formSearch) {
  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();

    const keywordValue = inputSearch.value.trim().toLowerCase();

    if (keywordValue === '') {
      renderMenuToHtml(masterMenuData);
    } else {
      const filteredResult = masterMenuData.filter((value) =>
        value.nama.toLowerCase().includes(keywordValue)
      );
      renderMenuToHtml(filteredResult);
    }
  });
}

initApp();
initBlogSlider();
