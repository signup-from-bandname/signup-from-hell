(function() {

var dogs = 1;

function next() {
  dogs += 1
  if (dogs <= 3) {
    $('.countthedogs img').attr('src', `assets/images/dogs${dogs}.jpg`)
    alert('correct, next!')
  } else {
    alert('correct! you passed!')
    $('.countthedogs .nextBtn').removeAttr('data-fake').off('click.dogs').click();
  }
}

function init() {
  console.log('doggies!')

  var button = $('.countthedogs .nextBtn').attr('data-fake', 'true');
  enableNextButton();

  var counter = 0;
  $('.countthedogs img').click(function() {
    counter += 1;
    console.log(counter)
  });
  button.on('click.dogs', function() {
    if (counter === 8) {
      next();
    } else {
      alert('wrong!')
    }
    counter = 0;
  })
}

window.initCountthedogs = init;

}());
