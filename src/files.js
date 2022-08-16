import { writeFile, readFile } from "fs/promises";

const IP_FILE = "adservers.txt";
const IP_FILE_TO_CHECK = "adservers_to_check.txt";

export const createFileCopy = async () => {
  try {
    await writeFile(IP_FILE_TO_CHECK, await readFile(IP_FILE, "utf8"), { flag: 'wx' }, "utf8");
  } catch (error) {
    if (error.errno === -17) {
      return console.log("File already exists");
    }

    throw error;
  }
}

const getFile = () => readFile(IP_FILE_TO_CHECK, "utf8")

export const getIps = async () => {
  const file = await getFile();

  const [, data] = file.split("=\n");

  const ips = data.match(/(?<=\d\s).*/g);

  return ips;
};

export const removeIpFromList = async (ip) => {
  const data = await getFile();

  const replacedData = data.replace(new RegExp(`.*${ip}`, 'g'), "");

  await writeFile(IP_FILE_TO_CHECK, replacedData, "utf8");
}