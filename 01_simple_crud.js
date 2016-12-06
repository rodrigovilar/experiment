var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder().build();
var ROOT_URL = 'http://localhost:3000/';
var CLICK_DELAY = 100;

var waitFor = function (condition, timeout, message) {
  driver.wait(until.elementLocated(condition), timeout, message);
  return find(condition, timeout, message);
};

var find = function (condition, timeout, message) {
  return driver.findElement(condition);
};

var clickLink = function (link, title) {
  waitFor(By.xpath('(//a[text()="' + link + '"])[last()]'), 3000, link + ' Link not found').click();
  driver.sleep(CLICK_DELAY);
  if (title) {
    waitFor(By.xpath('//h1[text()="' + title + '"]'), 3000, title + ' Title not found');
  }
}

var checkForm = function () {
  for(var i = 0; i < arguments.length; i++) {
    waitFor(By.xpath('//label[text()="' + arguments[i] + '"]'), 3000, arguments[i++] + ' Label not found');
    waitFor(By.xpath('//input[@id="' + arguments[i] + '"]'), 3000, arguments[i] + ' Input not found');
  }
}

var listingPage = function (url, title) {
  driver.get(url);
  waitFor(By.xpath('//h1[text()="Listing ' + title + '"]'), 3000, 'Listing ' + title + ' Title not found');
  for(var i = 2; i < arguments.length; i++) {
    waitFor(By.xpath('//th[text()="' + arguments[i] + '"]'), 3000, arguments[i] + ' Heading not found');
  }
}

var back = function () {
  find(By.xpath('//a[text()="Back"]')).click();
  driver.sleep(CLICK_DELAY);
}

var fillForm = function () {
  for(var i = 0; i < arguments.length; i++) { 
    var input = find(By.id(arguments[i++]));
    input.clear();
    input.sendKeys(arguments[i]);
  }
}

var clickButton = function(label) {
  find(By.xpath('//input[@value="' + label + '"]')).click();
  driver.sleep(CLICK_DELAY);
}

var message = function (message) {
  waitFor(By.xpath('//p[text()="' + message + '"]'), 3000, message + ' Message not found');
}

var show = function() {
  for(var i = 0; i < arguments.length; i++) { 
    waitFor(By.xpath('//strong[text()="' + arguments[i] + ':"]'), 3000, arguments[i++] + ': Strong not found');
    waitFor(By.xpath('//p[text()[contains(.,"' + arguments[i] + '")]]'), 3000, arguments[i] + ' P not found');
  }
}

var alertDialog = function() {
 return driver.switchTo().alert();
}
 
var ALUNOS_URL = ROOT_URL + 'alunos';
var ALUNOS_TITLE = 'Alunos';
var ALUNO_TITLE = 'Aluno';


listingPage(ALUNOS_URL, ALUNOS_TITLE, "Nome", "Matricula");

clickLink('New ' + ALUNO_TITLE, 'New ' + ALUNO_TITLE);
checkForm("Nome", "aluno_nome", "Matricula", "aluno_matricula");

back();

clickLink('New ' + ALUNO_TITLE, 'New ' + ALUNO_TITLE);
fillForm("aluno_nome", "abc", "aluno_matricula", "123");

clickButton('Create ' + ALUNO_TITLE);
message(ALUNO_TITLE + " was successfully created.");
show("Nome", "abc", "Matricula", "123");
back();

clickLink('Show');
show("Nome", "abc", "Matricula", "123");

clickLink('Edit', 'Editing ' + ALUNO_TITLE);
checkForm("Nome", "aluno_nome", "Matricula", "aluno_matricula");
back();

clickLink('Edit', 'Editing ' + ALUNO_TITLE);
fillForm("aluno_nome", "def", "aluno_matricula", "456");

clickButton('Update ' + ALUNO_TITLE);
message(ALUNO_TITLE + " was successfully updated.");
show("Nome", "def", "Matricula", "456");

clickLink('Edit', 'Editing ' + ALUNO_TITLE);

clickLink('Show');

back();

clickLink('Destroy');
alertDialog().accept();
message(ALUNO_TITLE + " was successfully destroyed.");

driver.quit();
