/**
 * One-time script: Import facilities from Static_Lists_businesses_filled.numbers
 * Run: npx tsx scripts/import-facilities-from-numbers.ts
 */
import { PrismaClient } from "@prisma/client";

const RAW_DATA = [
  {"Name":"Elev802 Boston","Address":"5 Dundee Park Dr, Andover, MA 01810","Email":"jon@elev802boston.com","Website URL":"https://www.elev802boston.com/","Offerings":"Real Ice, Treadmill, Shooting Skills, Stick Handling","Phone Number":"978-767-4118","Hours":""},
  {"Name":"Elev802 South Shore","Address":"57 French St, Stoughton, MA 02072","Email":"","Website URL":"https://www.elev802southshore.com/","Offerings":"Real Ice, Shooting Skills, Stick Handling","Phone Number":"","Hours":""},
  {"Name":"Elev802 VT","Address":"17 Reel Rd, South Burlington, VT 05403","Email":"","Website URL":"https://www.elev802.com/","Offerings":"Real Ice, Shooting Skills, Stick Handling","Phone Number":"802-578-6238","Hours":""},
  {"Name":"TCs Training Center","Address":"1 Esquire Rd, North Billerica, MA 01862","Email":"info@tcstrainingcenter.com","Website URL":"https://www.tcstrainingcenter.com/","Offerings":"Synthetic Ice, Skating (Edgework), Shooting Skills","Phone Number":"","Hours":"Mon-Thu 2:30-9pm; Fri 2:30-7pm; Sat-Sun 9am-2pm"},
  {"Name":"Premier Hockey","Address":"311 W River Rd, Hooksett, NH 03106","Email":"todd@premierhockey.com","Website URL":"https://www.premierhockey.com/","Offerings":"Synthetic Ice, Shooting Skills","Phone Number":"603-770-9630","Hours":""},
  {"Name":"WC Swans","Address":"","Email":"Raymond.Monroe@wcswanshockey.com","Website URL":"https://wcswanshockey.com/","Offerings":"Tournament Teams","Phone Number":"508-523-2657","Hours":""},
  {"Name":"Boston Hockey Skills","Address":"55 Concord St, North Reading, MA 01864","Email":"info@bostonhockeyskills.com","Website URL":"https://bostonhockeyskills.com/","Offerings":"Synthetic Ice, Shooting Skills, Stick Handling","Phone Number":"","Hours":""},
  {"Name":"Micro Ice","Address":"65 Flagship Dr, Building B, North Andover, MA 01845","Email":"icerentals@microicehockey.com","Website URL":"https://www.microicehockey.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"","Hours":""},
  {"Name":"GDS North Andover","Address":"65 Flagship Dr, Building B, North Andover, MA 01845","Email":"steve@gdsgoalies.com","Website URL":"https://www.gdsgoalies.com/","Offerings":"Real Ice, Goalie Training","Phone Number":"617-899-2922","Hours":""},
  {"Name":"GDS Exeter","Address":"40 Industrial Dr, Exeter, NH 03833","Email":"customerservice@therinksatexeter.com","Website URL":"https://www.gdsgoalies.com/","Offerings":"Synthetic Ice, Goalie Training","Phone Number":"603-775-7423","Hours":""},
  {"Name":"Paul Vincents","Address":"PO Box 1570, Newburyport, MA 01950","Email":"PVPHockey@aol.com","Website URL":"https://pvhockey.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"978-807-4070","Hours":""},
  {"Name":"Johnny DeRoche Hockey","Address":"","Email":"","Website URL":"https://www.facebook.com/NextLevelJD9/","Offerings":"Real Ice, Stick Handling","Phone Number":"612-812-0442","Hours":""},
  {"Name":"Ed Walsh Hockey School","Address":"13 Jamil Ln, Salem, NH 03079","Email":"Edwalsh@Edwalshhockeyschools.net","Website URL":"https://edwalshhockeyschools.net/","Offerings":"Synthetic Ice, Goalie Training","Phone Number":"603-498-5295","Hours":""},
  {"Name":"Stop It Goaltending","Address":"11 Cabot Rd, Woburn, MA 01801","Email":"customerservice@stopitgoaltending.com","Website URL":"https://stopitgoaltending.com/","Offerings":"Real Ice, Goalie Training","Phone Number":"833-878-6748","Hours":"Mon-Fri 8:30am-4pm"},
  {"Name":"Heads Up Hockey","Address":"14 Scott St, Unit 2, Gloucester, MA 01930","Email":"jonny@huhockey.com","Website URL":"https://huhockey.com/","Offerings":"Real Ice, Shooting Skills, Stick Handling","Phone Number":"978-697-8949","Hours":""},
  {"Name":"ProSkill Development","Address":"36 Sherwood Ave, Danvers, MA 01923","Email":"","Website URL":"https://proskilldevelopment.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"781-405-4849","Hours":""},
  {"Name":"Greg Carters","Address":"2320 Main St, Concord, MA 01742","Email":"info@gchockey.com","Website URL":"https://gchockey.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"978-371-3355","Hours":""},
  {"Name":"Pro Ambitions Hockey","Address":"PO Box 1011, West Falmouth, MA 02574","Email":"info@proambitions.com","Website URL":"https://proambitions.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"508-524-4236","Hours":""},
  {"Name":"Jay Philbin Hockey","Address":"","Email":"jayphilbinhockey@gmail.com","Website URL":"https://jayphilbinhockey.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"978-807-9810","Hours":""},
  {"Name":"Mass Crease Goaltending","Address":"77 Accord Park Dr, Unit D8, Norwell, MA 02061","Email":"Kalena@MassCrease.com","Website URL":"https://www.masscrease.com/","Offerings":"Goalie Training","Phone Number":"617-842-1409","Hours":"Mon-Fri 3-9pm; Sat-Sun 8-11am"},
  {"Name":"Elite Hockey Camp - NH","Address":"70 Main St, New Hampton, NH 03256","Email":"elitehockeycamps@gmail.com","Website URL":"https://elitehockeycamps.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"603-643-2078","Hours":""},
  {"Name":"NHL Sense Arena","Address":"11 Cabot Rd, Woburn, MA 01801","Email":"support@sensearena.com","Website URL":"https://hockey.sensearena.com/","Offerings":"Stick Handling, Goalie Training, Shooting Skills","Phone Number":"508-863-9709","Hours":""},
  {"Name":"Heads Up Hockey App","Address":"","Email":"","Website URL":"https://headsuphockey.ai/","Offerings":"Stick Handling","Phone Number":"","Hours":""},
  {"Name":"UltraSlide","Address":"3334 Commercial Avenue Northbrook, IL 60062","Email":"info@ultraslide.com","Website URL":"https://ultraslide.com/","Offerings":"Skating (Power)","Phone Number":"1 (847) 480-1366","Hours":""},
  {"Name":"Dangleverse","Address":"","Email":"","Website URL":"https://dangleverse.com/","Offerings":"Stick Handling","Phone Number":"","Hours":""},
  {"Name":"iTrain Hockey Camp","Address":"","Email":"admin@itrainhockey.com","Website URL":"https://itrainhockey.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"","Hours":""},
  {"Name":"iTrain Hockey App","Address":"","Email":"admin@itrainhockey.com","Website URL":"https://itrainhockey.com/","Offerings":"Shooting Skills, Skating (Power), Skating (Edgework), Stick Handling, App","Phone Number":"","Hours":""},
  {"Name":"23 Hockey","Address":"","Email":"","Website URL":"https://the23hockey.com/","Offerings":"Real Ice, Shooting Skills, Skating (Edgework), Skating (Power), Stick Handling","Phone Number":"","Hours":""},
  {"Name":"Will O'Neills","Address":"","Email":"","Website URL":"https://www.instagram.com/oneillhockey/","Offerings":"Real Ice, Stick Handling","Phone Number":"","Hours":""},
  {"Name":"Boston Hockey Club","Address":"","Email":"bostonhockeyclub2018@gmail.com","Website URL":"https://bostonhc.com/","Offerings":"Tournament Teams","Phone Number":"","Hours":""},
  {"Name":"NH Whalers","Address":"Amherst, NH 03031","Email":"nhwhalers@gmail.com","Website URL":"https://www.nhwhalers.com/","Offerings":"Tournament Teams","Phone Number":"603-305-3488","Hours":""},
  {"Name":"NH Knights","Address":"34 South Shore Dr, Center Barnstead, NH 03225","Email":"ckesselring@TotalSportsMgmt.com","Website URL":"https://nhknightshockey.com/","Offerings":"Tournament Teams","Phone Number":"603-785-9180","Hours":""},
  {"Name":"Boston Kraken","Address":"","Email":"info@bostonkrakenhc.com","Website URL":"https://www.bostonkrakenhc.com/","Offerings":"Tournament Teams","Phone Number":"","Hours":""},
  {"Name":"Dream Big Hockey Factory","Address":"","Email":"dreambighockey@gmail.com","Website URL":"https://dreambighockeystars.com/","Offerings":"Real Ice, Skating (Edgework), Skating (Power), Stick Handling, Tournament Teams, Shooting Skills","Phone Number":"617-388-5015","Hours":""},
  {"Name":"Real Speed","Address":"","Email":"cody@realspeedsports.com","Website URL":"https://realspeedsports.com/","Offerings":"Tournament Teams","Phone Number":"978-531-5900","Hours":""},
  {"Name":"Powersk8r","Address":"","Email":"orders@powersk8r.com","Website URL":"https://powersk8r.com/","Offerings":"Skating (Power)","Phone Number":"248-717-1370","Hours":"Mon-Fri 6am-7pm"},
];

function parseAddress(full: string): { address: string; city: string; zipCode: string } {
  const trimmed = full.trim();
  if (!trimmed || trimmed.length < 10) return { address: "", city: "", zipCode: "" };
  const zipMatch = trimmed.match(/,?\s*(\d{5}(?:-\d{4})?)\s*$/);
  const zipCode = zipMatch ? zipMatch[1].trim() : "";
  const rest = zipMatch ? trimmed.slice(0, zipMatch.index).trim().replace(/,?\s*$/, "") : trimmed;
  const parts = rest.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const city = parts.length >= 3 && /^[A-Z]{2}$/i.test(parts[parts.length - 1]) ? parts[parts.length - 2] : parts[parts.length - 1];
    const street = parts[0];
    return { address: trimmed, city, zipCode };
  }
  return { address: trimmed, city: "", zipCode };
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "facility";
}

async function main() {
  const prisma = new PrismaClient();
  const VALID_AMENITIES = ["Real Ice", "Synthetic Ice", "Shooting Skills", "Skating (Edgework)", "Skating (Power)", "Stick Handling", "Goalie Training", "Treadmill"];
  let created = 0;
  let skipped = 0;

  for (const row of RAW_DATA) {
    const name = (row.Name || "").trim();
    const addressRaw = (row.Address || "").trim();
    const offerings = (row["Offerings"] || "").trim();
    let description = offerings.length >= 10 ? offerings : `${name} - ${offerings}`.slice(0, 500);
    const offeringsList = offerings ? offerings.split(/[,;]/).map((s) => s.trim()).filter(Boolean) : [];
    const amenities = offeringsList.filter((s) => VALID_AMENITIES.includes(s));
    let facilityType: "in-person" | "app" | "at-home-trainer" | "tournament-teams" = "in-person";
    if (offeringsList.some((s) => /tournament teams/i.test(s)) || /tournament teams/i.test(name)) facilityType = "tournament-teams";
    else if (offeringsList.some((s) => /^app$/i.test(s)) || /app$/i.test(name)) facilityType = "app";

    if (!name) {
      skipped++;
      continue;
    }

    let address = addressRaw;
    let city: string = "";
    let zipCode: string = "";
    if (addressRaw) {
      const parsed = parseAddress(addressRaw);
      address = parsed.address;
      city = parsed.city;
      zipCode = parsed.zipCode;
    }

    if (!address || address.length < 5) {
      address = city && zipCode ? `${city}, ${zipCode}` : "Online / No physical address";
    }
    if (!city || city.length < 2) {
      const p = addressRaw ? parseAddress(addressRaw) : { city: "" };
      city = p.city || "N/A";
    }
    if (!zipCode || zipCode.length < 5) {
      const m = addressRaw?.match(/(\d{5}(?:-\d{4})?)/);
      zipCode = m ? m[1] : "00000";
    }
    if (!address || address.length < 5) address = "Online";
    if (!description || description.length < 10) {
      description = `${name} - ${offerings || "Hockey training"}`.slice(0, 500);
    }

    let slug = toSlug(name);
    let n = 1;
    while (await prisma.facilitySubmission.findFirst({ where: { slug } })) {
      slug = `${toSlug(name)}-${n}`;
      n++;
    }

    try {
      await prisma.facilitySubmission.create({
        data: {
          facilityName: name,
          address,
          city,
          zipCode,
          phone: (row["Phone Number"] || "").trim() || null,
          website: (row["Website URL"] || "").trim() || null,
          description,
          hours: (row.Hours || "").trim() || null,
          amenities: amenities.length > 0 ? amenities : (offeringsList[0] ? [offeringsList[0]] : ["Training"]),
          facilityType,
          status: "approved",
          slug,
        },
      });
      console.log("Added:", name);
      created++;
    } catch (e) {
      console.error("Failed:", name, e);
    }
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`);
  await prisma.$disconnect();
}

main();
