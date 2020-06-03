'Use Strict';

let page1 = [];
let page2 = [];
let pageSwitch = true;

const menu = $('#animal-menu');
const photos = $('#photo-template').html();

function Animals(obj, arr) {
  this.url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.horns = obj.horns;
  this.keyword = obj.keyword;
  arr.push(this);
}

Animals.prototype.render = function () {

  // grab element
  const $newSection = $(`<section data-render="dynamic">${photos}</section>`);

  $newSection.find('h2').text(this.title);
  $newSection.find('p').text(this.description);
  $newSection.find('img').attr('src', this.url).attr('alt', this.title);

  $('main').append($newSection);
}

// function to display the animal drop-down menu
const dropDown = () => {

  let keywords = [];

  page1.forEach((animal, i) => {
    const $newOption = $('<option></option>');
    if (!keywords.includes(`${page1[i].keyword}`)) {

      $newOption.attr('value', `${page1[i].keyword}`);
      $newOption.text(`${page1[i].keyword}`);
      keywords.push(`${page1[i].keyword}`);
      menu.append($newOption);
    }
  })
}

// event to render the images of the title selected from 
// the drop down menu
menu.on('change', function () {

  $('section[data-render="dynamic"]').remove();

  page1.forEach(animal => {
    if (animal.keyword === this.value) {
      animal.render();
    } else if (this.value === 'default') {
      animal.render();
    }
  })
});

// filter the results based on which sort option is selected
$('#sort-options').on('change', function () {
  $('section[data-render="dynamic"]').remove();
  if (this.value === 'title') {
    page1 = page1.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    page2 = page2.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else {
    page1 = page1.sort(function (a, b) {
      return b.horns - a.horns;
    });
    page2 = page2.sort(function (a, b) {
      return b.horns - a.horns;
    });
  }
  return pageSwitch ? page1.forEach(animal => animal.render()) :
    page2.forEach(animal => animal.render());
});

// render page-1.json images when a right arrow is clicked
$('.left').click(() => {
  pageSwitch = true;
  $('section[data-render="dynamic"]').remove();
  page1.forEach(animal => animal.render())
})

// render page-2.json images when a right arrow is clicked
$('.right').click(() => {
  pageSwitch = false;
  $('section[data-render="dynamic"]').remove();
  page2.forEach(animal => animal.render());
});

// grab animal data from page-1.json
$.ajax('data/page-1.json', {
    method: 'GET',
    dataType: 'JSON'
  })
  .then(data => {
    data = data.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    data.forEach(animal => {
      new Animals(animal, page1).render();
    });
    dropDown();
  });

// grab animal data from page-2.json
$.ajax('data/page-2.json', {
    method: 'GET',
    dataType: 'JSON'
  })
  .then(data => {
    data = data.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    data.forEach(animal => {
      new Animals(animal, page2)
    });
    dropDown();
  });