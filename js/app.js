'Use Strict';

let allAnimals = [];
const menu = $('#animal-menu');
const photos = $('#photo-template').html();

function Animals(obj) {
  this.url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.horns = obj.horns;
  this.keyword = obj.keyword;
  allAnimals.push(this);
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

  allAnimals.forEach((animal, i) => {
    const $newOption = $('<option></option>');
    if (!keywords.includes(`${allAnimals[i].keyword}`)) {

      $newOption.attr('value', `${allAnimals[i].keyword}`);
      $newOption.text(`${allAnimals[i].keyword}`);
      keywords.push(`${allAnimals[i].keyword}`);
      menu.append($newOption);
    }
  })
}

// event to render the images of the title selected from 
// the drop down menu
menu.on('change', function () {

  $('section[data-render="dynamic"]').remove();

  allAnimals.forEach(animal => {
    if (animal.keyword === this.value) {
      animal.render();
    }
  })
})

// grab animal data from page-1.json
$.ajax('data/page-1.json', {
    method: 'GET',
    dataType: 'JSON'
  })
  .then(data => {
    data.forEach(animal => {
      new Animals(animal).render();
    });
    dropDown();
  })