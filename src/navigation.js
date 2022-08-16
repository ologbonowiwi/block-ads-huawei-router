import { removeIpFromList } from "./files";

const removeUrl = async url => {
  await page.screenshot({ path: `ips_screenshots/${Date.now()}${url}.png`, fullPage: true });
  await page.waitForSelector("#add_urlfilter_btn");
  await page.click("#add_urlfilter_btn");

  await page.waitForSelector("#urlfilter_URL_ctrl");
  await page.type("#urlfilter_URL_ctrl", url)

  await page.waitForSelector("#submit");
  await page.click("#submit");
}

const login = async page => {
  const ROUTER_URL = ""; // Your HUAWEI router url
  const PASSWORD = ""; // Your HUAWEI router admin password

  await page.goto(ROUTER_URL);

  await page.waitForSelector("#userpassword_ctrl")
  await page.type("#userpassword_ctrl", PASSWORD);
  await page.keyboard.press("Enter");
}

const enterOnParentalControl = async page => {
  await page.waitForSelector("#more > div")
  await page.click("#more > div");

  await page.waitForSelector("#morePage > div > div.right_box.fl.border_1px_left > div");

  
  await page.waitForSelector("#safesettingsparent_menuId");
  await page.click("#safesettingsparent_menuId");
  
  await page.waitForSelector("#parentcontrol_menuId");
  await page.screenshot({ path: 'beforeClickParentalControl.png', fullPage: true })
  await page.click("#parentcontrol_menuId");
  await page.screenshot({ path: 'afterClickParentalControl.png', fullPage: true })
}

export const disableIps = async (ips, page) => {
  await login(page);

  console.log('Logged');

  await enterOnParentalControl(page);

  console.log('Entered on parental control');

  for (const ip of ips) {
    console.log('Removing ip :>>', ip);
    await removeUrl(ip);
    await removeIpFromList(ip);
    await page.waitForSelector("#loading", { hidden: true });
    console.log('Ip removed :>>', ip);
  }

  await page.waitForNavigation();
}
