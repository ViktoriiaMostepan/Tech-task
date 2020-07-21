import { Selector } from "testcafe";

const pjson = require("../../package.json");
const BASE_URL = pjson.baseUrl;
const FIRST_URL = `${BASE_URL}/first`;
const SECOND_URL = `${BASE_URL}/second`;

const RED_TEXT = "Incorrect";
const GREEN_TEXT = "Correct";

const RED_COLOR = "rgb(255, 0, 0)";
const GREEN_COLOR = "rgb(0, 255, 0)";

const firstPageButton = Selector("button").withAttribute(
  "try-to-find-this-attribute",
  "find-by-me"
);
const text = () => Selector("h1").find("span").textContent;

fixture(`My first fixture`).page(BASE_URL);

test("my test", async (t) => {
  const docURI = () => t.eval(() => document.documentURI);

  await t
    .setTestSpeed(0.5)
    // check if url is correct. It means it's same as expected (first), no redirection happened after initial attempt to access
    .expect(docURI())
    .eql(FIRST_URL)
    // click on button and check if url is correct after redirection
    .click(firstPageButton)
    .expect(docURI())
    .eql(SECOND_URL)
    // check that h2 text is 'Incorrect' and color is red by default
    .expect(Selector("h2").innerText)
    .eql(RED_TEXT)
    .expect(Selector("h2").getStyleProperty("color"))
    .eql(RED_COLOR);

  //type correct value and check that h2 text is 'Correct' and color is green
  await t
    .typeText(Selector("input"), await text())
    .expect(Selector("h2").innerText)
    .eql(GREEN_TEXT)
    .expect(Selector("h2").getStyleProperty("color"))
    .eql(GREEN_COLOR)
    // type incorrect value and check that h2 text is 'Incorrect' and color is red
    .pressKey("ctrl+a delete")
    .typeText(Selector("input"), "Incorrect text")
    .expect(Selector("h2").innerText)
    .eql(RED_TEXT)
    .expect(Selector("h2").getStyleProperty("color"))
    .eql(RED_COLOR);
}).after(async (t) => {
  await t.pressKey("ctrl+a delete"); // clear input field
});
