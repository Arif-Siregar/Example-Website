import fs from "fs";
import { parse as csvparser } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const items = async () => {
  const allItems = await prisma.$queryRaw`
SELECT
  id,
  name
FROM "Item"
ORDER BY "Item".name ASC
LIMIT 4
`;
  console.log(allItems);
};

const readcsv = async <T>(csvcontent: string) => {
  const parser = csvparser({ columns: true });
  const records = new Array<T>();

  parser
    .on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    })
    .on("error", (err) => {
      console.error(err.message);
    });

  parser.write(csvcontent);
  parser.end();
  return records;
};

const importCouncils = async () => {
  type CouncilCSV = {
    "Locality Name": string;
    "Post Code": string;
    "Municipality Name": string;
  };
  fs.readFile("../councils.csv", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const records = await readcsv<CouncilCSV>(data);
    const cmap: Record<string, Record<string, string>> = {};
    for (const {
      "Post Code": code,
      "Locality Name": subname,
      "Municipality Name": name,
    } of records) {
      if (!cmap[name]) {
        cmap[name] = {};
      }
      cmap[name][subname] = code;
    }
    const entries = Object.entries(cmap);
    const total = entries.length;
    let i = 0;
    for (const [name, submap] of entries) {
      const res = await prisma.council.create({
        data: {
          name,
          suburbs: {
            create: Object.entries(submap).map(([name, postcode]) => ({
              name,
              postcode,
            })),
          },
        },
      });
      console.log(`${i++}/${total} ${name} ${res.id}`);
    }
  });
};

const importItems = async () => {
  type ItemCSVColumns = { Category: string; Subcategory: string; Item: string };
  fs.readFile("../items.csv", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const records = await readcsv<ItemCSVColumns>(data);
    const catemap = new Map<string, Record<string, Set<string>>>();
    for (const { Category, Subcategory, Item } of records) {
      if (!catemap.has(Category)) {
        catemap.set(Category, {});
      }
      const submap = catemap.get(Category)!;
      if (!submap[Subcategory]) {
        submap[Subcategory] = new Set();
      }
      submap[Subcategory].add(Item);
    }

    const categories: { name: string; id: number }[] = [];
    const subcategories: {
      name: string;
      id: number;
      primaryMaterialId: number;
    }[] = [];
    const allitems: { name: string; id: number; subCategoryId: number }[] = [];
    let i = 0,
      j = 0,
      k = 0;

    Array.from(catemap.entries()).forEach(([category, submap]) => {
      i++;
      categories.push({ name: category, id: i });
      Array.from(Object.entries(submap)).forEach(([subcategory, items]) => {
        j++;
        subcategories.push({ name: subcategory, id: j, primaryMaterialId: i });
        items.forEach((item) => {
          k++;
          allitems.push({ name: item, id: k, subCategoryId: j });
        });
      });
    });

    await prisma.$transaction([
      prisma.primaryMaterial.createMany({
        data: JSON.parse(JSON.stringify(categories)),
      }),
      prisma.subCategory.createMany({
        data: subcategories,
      }),
      prisma.item.createMany({
        data: allitems,
      }),
    ]);
  });
};

// clear();
// importItems();
