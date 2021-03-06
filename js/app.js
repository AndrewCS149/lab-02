'Use Strict';
let page = [];
let page1 = [];
let page2 = [];
let pageSwitch = true;

const menu = $('#animal-menu');

function Animals(obj, arr) {
  this.url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.horns = obj.horns;
  this.keyword = obj.keyword;
  arr.push(this);
}

// mustache templating to render new sections to the page 
Animals.prototype.toHtml = function () {
  // grab element
  const template = $(`#template`).html();
  $('main').append(Mustache.render(template, this));
}

// Add click event to each image. When the image is clicked, 
// its size increases and displays a more detailed view.
$('#target').on('click', function () {
  let clicked = event.target.parentNode.children[1].src;
  console.log(event)
  const template = $(`#template`).html();
  $('#modal').empty().toggleClass('hide');
  page.forEach(obj => {
    if (obj.url === clicked) {
      $('#modal').append(Mustache.render(template, obj))
    }
  })
})

// function to display the animal drop-down menu
const dropDown = () => {
  let keywords = [];
  page1.forEach(x => page.push(x))
  page2.forEach(x => page.push(x))
  page.forEach(animal => {
    const optionTemp = $('#option-template').html();
    if (!keywords.includes(`${animal.keyword}`)) {
      keywords.push(`${animal.keyword}`);
      menu.append(Mustache.render(optionTemp, animal));
    }
  })
}

// event to render the images of the title selected from 
// the drop down menu
menu.on('change', function () {

  $('section[data-render="dynamic"]').remove();

  page.forEach(animal => {
    if (animal.keyword === this.value) {
      animal.toHtml();
    } else if (this.value === 'default') {
      animal.toHtml();
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
  return pageSwitch ? page1.forEach(animal => animal.toHtml()) :
    page2.forEach(animal => animal.toHtml());
});

// render page-1.json images when a right arrow is clicked
$('.left').click(() => {
  pageSwitch = true;
  $('section[data-render="dynamic"]').remove();
  page1.forEach(animal => animal.toHtml())
})

// render page-2.json images when a right arrow is clicked
$('.right').click(() => {
  pageSwitch = false;
  $('section[data-render="dynamic"]').remove();
  page2.forEach(animal => animal.toHtml());
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
      new Animals(animal, page1).toHtml();
    });
    // dropDown();
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