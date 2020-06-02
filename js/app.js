'Use Strict';

let allAnimals = [];

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
  const photos = $('#photo-template').html();
  const $newSection = $(`<section>${photos}</section>`);

  $newSection.find('h2').text(this.title);
  $newSection.find('p').text(this.description);
  $newSection.find('img').attr('src', this.url).attr('alt', this.title);

  $('main').append($newSection);
}





$.ajax('data/page-1.json', {
    method: 'GET',
    dataType: 'JSON'
  })
  .then(data => {
    data.forEach(animal => {
      new Animals(animal).render();
    });
  })