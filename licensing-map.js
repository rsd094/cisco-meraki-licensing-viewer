// Hardware model -> subscription license class, per the Meraki documentation:
//   Subscription - MX, MS, MR, MV, MT, MG, Z Licensing; Unified Licensing for Wi-Fi 7 APs,
//   Cisco Smart Switching and Cisco 8000 Series Secure Routers; plus the Cisco Cloud-Managed
//   Switching family data sheet and the MS130 datasheet for the switch model lists.
// Models are normalised before lookup: upper-cased, with "-HW", "-HW-NA/WW/JP" and a
// trailing Catalyst "-M" removed. Edit this file if Meraki adds models.

const LICENSE_CLASSES = [
  // ---- MX / vMX ----
  { cls: "MX Small", sku: "LIC-MX-S", family: "MX", models: ["MX50","MX60","MX60W","MX64","MX64W","MX65","MX65W","MX67","MX67C","MX67W","MX68","MX68W","MX68CW","VMX-S"] },
  { cls: "MX Medium", sku: "LIC-MX-M", family: "MX", models: ["MX70","MX75","MX80","MX84","MX85","VMX-M"] },
  { cls: "MX Large", sku: "LIC-MX-L", family: "MX", models: ["MX90","MX95","MX100","MX105","MX400","VMX100","VMX-L"] },
  { cls: "MX X-Large", sku: "LIC-MX-XL", family: "MX", models: ["MX250","MX450","MX600","VMX-XL"] },
  // ---- Cisco 8000 Series Secure Routers (Unified Licensing: Cisco WAN Essentials / Advantage) ----
  // Model strings vary (C8121-G2, C8121-G2-MX, C8121-W-G2-MX...), so these are matched by number in classifyModel.
  { cls: "Secure Router Small", sku: "LIC-CSWAN-S", family: "MX", unified: true, models: ["C8111-G2","C8121-G2"] },
  { cls: "Secure Router Medium", sku: "LIC-CSWAN-M", family: "MX", unified: true, models: ["C8231-G2","C8235-G2"] },
  { cls: "Secure Router Large", sku: "LIC-CSWAN-L", family: "MX", unified: true, models: ["C8355-G2","C8375-E-G2"] },
  { cls: "Secure Router X-Large", sku: "LIC-CSWAN-XL", family: "MX", unified: true, models: ["C8455-G2","C8475-G2","C8550-G2","C8570-G2"] },
  // ---- Z teleworker ----
  { cls: "Z", sku: "LIC-Z", family: "Z", models: ["Z1","Z3","Z3C","Z4","Z4C"] },
  // ---- MS ----
  { cls: "MS100 Small", sku: "LIC-MS-100-S", family: "MS", models: ["MS120-8","MS120-8LP","MS120-8FP","MS130-8","MS130-8P","MS130-8P-I","MS130-8X","MS130R-8P","MS130-12X","MS220-8","MS220-8P"] },
  { cls: "MS100 Medium", sku: "LIC-MS-100-M", family: "MS", models: ["MS120-24","MS120-24P","MS125-24","MS125-24P","MS130-24","MS130-24P","MS130-24X","MS150-24T-4G","MS150-24P-4G","MS150-24T-4X","MS150-24P-4X","MS150-24MP-4X","MS22","MS22P","MS220-24","MS220-24P"] },
  { cls: "MS100 Large", sku: "LIC-MS-100-L", family: "MS", models: ["MS120-48","MS120-48LP","MS120-48FP","MS125-48","MS125-48LP","MS125-48FP","MS130-48","MS130-48P","MS130-48X","MS150-48T-4G","MS150-48LP-4G","MS150-48FP-4G","MS150-48T-4X","MS150-48LP-4X","MS150-48FP-4X","MS150-48MP-4X","MS220-48","MS220-48LP","MS220-48FP","MS42","MS42P"] },
  { cls: "MS200 Small (Catalyst)", sku: "—", family: "MS", catalyst: true, models: ["C9200CX-12T-2X2G","C9200CX-12P-2X2G","C9200CX-8P-2X2G","C9200CX-8UXG-2X","C9200CX-12P-2XGH","C9200CX-8P-2XGH","C9200CX-8UXG-2XH","C9200CX-8PT-2G"] },
  { cls: "MS200 Medium", sku: "LIC-MS-200-M", family: "MS", models: ["MS210-24","MS210-24P","MS225-24","MS225-24P","MS250-24","MS250-24P","MS320-24","MS320-24P"] },
  { cls: "MS200 Medium (Catalyst)", sku: "LIC-MS-200-M", family: "MS", catalyst: true, models: ["C9200L-24T-4G","C9200L-24P-4G","C9200L-24T-4X","C9200L-24P-4X","C9200L-24PXG-4X","C9200L-24PXG-2Y"] },
  { cls: "MS200 Large", sku: "LIC-MS-200-L", family: "MS", models: ["MS210-48","MS210-48LP","MS210-48FP","MS225-48","MS225-48LP","MS225-48FP","MS250-48","MS250-48LP","MS250-48FP","MS320-48","MS320-48LP","MS320-48FP"] },
  { cls: "MS200 Large (Catalyst)", sku: "LIC-MS-200-L", family: "MS", catalyst: true, models: ["C9200L-48T-4G","C9200L-48P-4G","C9200L-48T-4X","C9200L-48P-4X","C9200L-48PL-4G","C9200L-48PL-4X","C9200L-48PXG-4X","C9200L-48PXG-2Y"] },
  { cls: "MS300 Medium", sku: "LIC-MS-300-M", family: "MS", models: ["MS350-24","MS350-24P","MS350-24X","MS355-24X","MS355-24X2","MS390-24","MS390-24P","MS390-24U","MS390-24UX"] },
  { cls: "MS300 Medium (Catalyst)", sku: "LIC-MS-300-M", family: "MS", catalyst: true, models: ["C9300-24T","C9300-24P","C9300-24U","C9300-24UX","C9300X-12Y","C9300X-24Y","C9300X-24HX","C9300-24S","C9300L-24T-4X","C9300L-24P-4X","C9300L-24UXG-4X","C9300LM-24U-4Y"] },
  { cls: "MS300 Large", sku: "LIC-MS-300-L", family: "MS", models: ["MS350-48","MS350-48LP","MS350-48FP","MS355-48X","MS355-48X2","MS390-48","MS390-48P","MS390-48U","MS390-48UX","MS390-48UX2"] },
  { cls: "MS300 Large (Catalyst)", sku: "LIC-MS-300-L", family: "MS", catalyst: true, models: ["C9300-48T","C9300-48P","C9300-48U","C9300-48S","C9300-48UXM","C9300-48UN","C9300X-48TX","C9300X-48HX","C9300X-48HXN","C9300L-48T-4X","C9300L-48P-4X","C9300L-48PF-4X","C9300L-48UXG-4X","C9300LM-48T-4Y","C9300LM-48U-4Y","C9300LM-48UX-4Y"] },
  { cls: "MS400 Medium", sku: "LIC-MS-400-M", family: "MS", models: ["MS410-16","MS420-24","MS425-16"] },
  { cls: "MS400 Large", sku: "LIC-MS-400-L", family: "MS", models: ["MS410-32","MS420-48","MS425-32","MS450-12"] },
  // ---- Cisco Smart Switching (Unified Licensing: Cisco Networking Subscription) ----
  { cls: "Switching Access Medium", sku: "LIC-CS-AC1-M", family: "MS", unified: true, models: ["C9350-24T","C9350-24P","C9350-24U"] },
  { cls: "Switching Access Large", sku: "LIC-CS-AC1-L", family: "MS", unified: true, models: ["C9350-48T","C9350-48P","C9350-48U","C9350-48TX","C9350-48HX","C9350-48-HX"] },
  { cls: "Switching Core Medium", sku: "LIC-CS-CO-M", family: "MS", unified: true, advOnly: true, models: ["C9550-24L4CD"] },
  { cls: "Switching Core Large", sku: "LIC-CS-CO-L", family: "MS", unified: true, advOnly: true, models: ["C9550-32C","C9550-48L4CD"] },
  { cls: "Switching Core X-Large", sku: "LIC-CS-CO-XL", family: "MS", unified: true, advOnly: true, models: ["C9550-64C-XL","C9550-96L4D"] },
  { cls: "Switching Core Modular", sku: "LIC-CS-CO-MO", family: "MS", unified: true, advOnly: true, models: ["C9610R","C9610"] },
  // ---- MR (Wi-Fi 6/6E and earlier) ----
  { cls: "Wireless (MR)", sku: "LIC-MR", family: "MR", models: ["MR11","MR12","MR14","MR16","MR18","MR20","MR24","MR26","MR28","MR30H","MR32","MR33","MR34","MR36","MR36H","MR42","MR42E","MR44","MR45","MR46","MR46E","MR52","MR53","MR53E","MR55","MR56","MR57","MR58","MR58-CAR","MR58-PRO","MR62","MR66","MR70","MR72","MR74","MR76","MR78","MR84","MR86","CW9162I","CW9163E","CW9164I","CW9166I","CW9166D1"] },
  // ---- Wi-Fi 7 (Unified licensing) ----
  { cls: "Wi-Fi 7 (CW)", sku: "LIC-CW", family: "CW", unified: true, models: ["CW9171I","CW9172I","CW9172H","CW9174I","CW9174E","CW9176D1","CW9176I","CW9178I","CW9179F"] },
  // ---- MV cameras (Subscription - MV Licensing) ----
  { cls: "Camera", sku: "LIC-MV", family: "MV", models: ["MV12N","MV12W","MV12WE","MV13","MV13M","MV2","MV21","MV22","MV22X","MV23M","MV23X","MV32","MV33","MV33M","MV52","MV63","MV63M","MV63X","MV71","MV72","MV72X","MV73M","MV73X","MV93","MV93M","MV93X"] },
  { cls: "Camera (multi-imager)", sku: "LIC-MV-MULTCAM", family: "MV", models: ["MV84X","MV44X"] },
  // ---- MT sensors (Subscription - MT Licensing) ----
  { cls: "Sensor", sku: "LIC-MT", family: "MT", models: ["MT10","MT11","MT12","MT14","MT15","MT20","MT30","MT40"] },
  // ---- MG cellular gateways (Subscription - MG Licensing) ----
  { cls: "Cellular gateway", sku: "LIC-MG", family: "MG", models: ["MG21","MG21E","MG41","MG41E","MG51","MG51E","MG52","MG52E"] },
];

// MS doc footnote (*): applies only in cloud monitoring or config-source-device mode;
// a fully Meraki-managed Catalyst switch consumes the SKU listed for it.
const CATALYST_NOTE = "* Devices with a DNA license don't need an additional Meraki subscription license when in cloud monitoring or cloud management (configuration source: device). Fully Meraki-managed, this SKU applies.";

function normaliseModel(model) {
  return String(model || "").toUpperCase().trim()
    .replace(/-HW(-(NA|WW|JP|EU|UK|AU))?$/, "")
    .replace(/-(MR)$/, "")          // CW9166I-MR -> CW9166I
    .replace(/^(C9[23]\S*?)-M$/, "$1"); // C9300-24P-M -> C9300-24P
}

const _modelIndex = new Map();
for (const c of LICENSE_CLASSES) for (const m of c.models) _modelIndex.set(m, c);

// Returns { cls, sku, family, inferred, note }
function classifyModel(model) {
  const m = normaliseModel(model);
  const exact = _modelIndex.get(m);
  if (exact) return { ...exact, inferred: false, note: exact.catalyst ? CATALYST_NOTE : "" };

  // Fallbacks for models not explicitly listed in the docs (flagged as inferred).
  const inf = (cls, sku, family, note) => ({ cls, sku, family, inferred: true, note: note || "Not listed in docs — inferred from model family" });
  if (/^MR\d/.test(m) || /^CW916/.test(m)) return inf("Wireless (MR)", "LIC-MR", "MR");
  if (/^CW917/.test(m)) return inf("Wi-Fi 7 (CW)", "LIC-CW", "CW");
  if (/^Z\d/.test(m)) return inf("Z", "LIC-Z", "Z");
  const ms = m.match(/^MS(\d+)R?-(\d+)/);
  if (ms) {
    const fam = +ms[1], ports = +ms[2];
    const size = ports <= 12 ? "S" : ports <= 24 ? "M" : "L";
    const sizeName = { S: "Small", M: "Medium", L: "Large" }[size];
    let tier = fam < 200 || (fam >= 220 && fam < 230) ? 100 : fam < 350 ? 200 : fam < 400 ? 300 : 400;
    return inf(`MS${tier} ${sizeName}`, `LIC-MS-${tier}-${size}`, "MS");
  }
  const cr = m.match(/^C8(\d)(\d\d)/);
  if (cr) {
    const size = { "111": "S", "121": "S", "231": "M", "235": "M", "355": "L", "375": "L", "455": "XL", "475": "XL", "550": "XL", "570": "XL" }[cr[1] + cr[2]];
    if (size) return { ...LICENSE_CLASSES.find(c => c.sku === `LIC-CSWAN-${size}`), inferred: false, note: "" };
  }
  if (/^C9350/.test(m)) return inf(/-48/.test(m) ? "Switching Access Large" : "Switching Access Medium", /-48/.test(m) ? "LIC-CS-AC1-L" : "LIC-CS-AC1-M", "MS");
  if (/^C9800/.test(m)) return inf("Catalyst WLC", "—", "WLC", "Catalyst 9800 WLC — outside the referenced docs");
  if (/^C91\d\d/.test(m)) return inf("Catalyst AP (via WLC)", "—", "MR", "Catalyst AP behind a 9800 WLC — outside the referenced docs");
  if (/^MG/.test(m)) return inf("Cellular gateway", "LIC-MG", "MG");
  if (/^MV/.test(m)) return inf("Camera (MV)", "LIC-MV", "MV", "MV — outside the referenced docs");
  if (/^MT/.test(m)) return inf("Sensor (MT)", "LIC-MT", "MT", "MT — outside the referenced docs");
  return { cls: "Unmapped", sku: "—", family: "Other", inferred: true, note: "No matching license class in the referenced docs" };
}

// ---------- Co-termination licensing ----------
// Co-term (and per-device) licenses are per hardware model, not per size class, and the edition
// is set org-wide per product line. Sources: Meraki docs "Co-Termination Licensing",
// "Meraki MR License Guide", "MX/Z Security and SD-WAN Licensing", MS390 and Catalyst 9300-M
// datasheets. SKUs are shown without the term suffix (-1YR, -3Y, ...), which varies by product.
//   line "mx"  : MX edition Enterprise (ENT) / Advanced Security (SEC) / Secure SD-WAN Plus (SDW)
//   line "vmx" : vMX Enterprise (ENT) / Advanced Security (SEC)
//   line "z4"  : Z4 Enterprise (ENT) / Secure Teleworker (SEC)
//   line "mr"  : MR Enterprise (LIC-ENT) / MR Advanced (LIC-MR-ADV), model-agnostic, Wi-Fi 7 included
//   line "ms"  : MS130, MS150, MS390, Catalyst C9300-M / C9200L-M: Enterprise / Advanced, one tier per org
//   line "cns" : unified Cisco Networking Subscription in any org: Wi-Fi 7 (LIC-CW) and C9350 / C9550 / C9610
//                smart switches (LIC-CS-...), Essentials / Advantage (C9550 and C9610 are Advantage only)
// Cisco 8000 Secure Routers take the org's MX edition like any MX (Enterprise / Advanced Security / SD-WAN Plus)
// and can run unified Cisco WAN licensing (LIC-CSWAN-...) instead.
// `key` is the license row the device counts against (e.g. MS130-8X counts against MS130-CMPT).
const MS130_COMPACT = /^MS130R?-(8|8P|8P-I|8X|12X)$/;
const COTERM_DOCS = "https://documentation.meraki.com/Platform_Management/Product_Information/Meraki_Licensing/Co-Termination_Licensing";
function cotermLicense(model, family) {
  const m = normaliseModel(model);
  const r = (key, line, sku, note, inferred, advOnly) => ({ key, line, sku, note: note || "", inferred: !!inferred, advOnly: !!advOnly });
  const tiered = (key, ent, adv, note, inferred) => r(key, "ms", code => code === "ADV" ? adv : ent, note, inferred);
  let x;
  if (/^C9800/.test(m)) return r(m, null, null, "Catalyst 9800 wireless controller: not licensed through Meraki co-term");
  if (/^C91\d\d/.test(m)) return r(m, null, null, "Catalyst AP managed by a 9800 controller: not licensed through Meraki co-term");
  // Wi-Fi 7 follows unified licensing (LIC-CW Essentials / Advantage); in a co-term org it counts against the MR license
  if (/^CW917/.test(m)) return r("MR", "cns", code => code === "ADV" ? "LIC-CW-A" : "LIC-CW-E",
    "Wi-Fi 7 uses unified licensing (LIC-CW); in a co-term org it counts against the MR licenses and follows the MR edition (Advanced = Advantage)");
  if (family === "MR" || family === "CW" || /^(MR\d|CW916)/.test(m))
    return r("MR", "mr", code => code === "ADV" ? "LIC-MR-ADV" : "LIC-ENT", "MR licenses are model-agnostic");
  const uni = classifyModel(model);
  if (uni.unified && /^C9[356]/.test(m)) return r(m, "cns", code => `${uni.sku}-${code === "ADV" || uni.advOnly ? "A" : "E"}`,
    `Smart switch: unified Cisco Networking Subscription (${uni.cls})${uni.advOnly ? ", Advantage only" : ""}; classic co-term SKUs aren't published`, false, uni.advOnly);
  if (/^MV/.test(m)) return r("MV", null, () => "LIC-MV");
  if (/^MT/.test(m)) return r("MT", null, () => "LIC-MT");
  if ((x = m.match(/^VMX-?(S|M|L|XL)$/))) return r(`VMX-${x[1]}`, "vmx", code => `LIC-VMX-${x[1]}-${code === "ENT" ? "ENT" : "SEC"}`);
  if (/^VMX100$/.test(m)) return r("VMX100", null, () => "LIC-VMX100");
  if (/^MX\d/.test(m)) {
    const sz = /^MX6[45]/.test(m) ? "XS" : /^MX6[78]/.test(m) ? "S" : /^MX(75|8[45])/.test(m) ? "M" : /^MX(95|10[05])/.test(m) ? "L" : /^MX(250|450)/.test(m) ? "XL" : "";
    return r(m, "mx", code => `LIC-${m}-${code}`, "Each MX model has its own license, e.g. an MX64 license won't cover an MX64W" +
      (sz ? `. In an Advanced Security org a network can add per-device SD-WAN+ (LIC-MX-SDW-${sz})` : ""));
  }
  if (/^Z4C?$/.test(m)) return r(m, "z4", code => `LIC-${m}-${code === "ENT" ? "ENT" : "SEC"}`);
  if (/^Z\d/.test(m)) return r(m, null, () => `LIC-${m}-ENT`, "Z1/Z3 only take Enterprise licenses");
  if ((x = m.match(/^MG(\d+)E?$/))) return r(`MG${x[1]}`, null, () => `LIC-MG${x[1]}-ENT`);
  if (MS130_COMPACT.test(m)) return tiered("MS130-CMPT", "LIC-MS130-CMPT", "LIC-MS130-CMPTA", "One license covers the MS130 compact models (8, 8P, 8P-I, 8X, 12X)");
  if ((x = m.match(/^(MS1[35]0)R?-(\d+)/))) return tiered(`${x[1]}-${x[2]}`, `LIC-${x[1]}-${x[2]}`, `LIC-${x[1]}-${x[2]}A`, `One license per port count (${x[1]}-${x[2]})`);
  if ((x = m.match(/^MS390-(\d+)/))) return tiered(`MS390-${x[1]}`, `LIC-MS390-${x[1]}E`, `LIC-MS390-${x[1]}A`, `One license per port count (MS390-${x[1]})`);
  if ((x = m.match(/^C9300[LX]?M?-(\d+)/))) {
    const p = +x[1] <= 24 ? 24 : 48;
    return tiered(`C9300-${p}`, `LIC-C9300-${p}E`, `LIC-C9300-${p}A`, `One license covers C9300, C9300L and C9300X ${p}-port models`);
  }
  if ((x = m.match(/^C9200L-(\d+)/))) {
    const p = +x[1] <= 24 ? 24 : 48;
    return tiered(`C9200L-${p}`, `LIC-C9200L-${p}E`, `LIC-C9200L-${p}A`, `One license covers the C9200L-M ${p}-port models`);
  }
  if (/^C9200CX/.test(m)) return r(m, null, null, "No co-term license documented for C9200CX");
  if (/^MS\d/.test(m)) return r(m, null, () => `LIC-${m}`, "Each MS model has its own license, e.g. MS220-8 and MS220-8P differ");
  if ((x = m.match(/^C(8\d{3})/))) {
    // C8121-G2-MX counts against the "C8121" license row and takes the org's MX edition
    const key = `C${x[1]}`, uni = classifyModel(model);
    return r(key, "mx", code => `LIC-${key}-${code}`,
      `Cisco Secure Router: takes the org's MX edition like any MX; co-term SKU follows the MX pattern. It can also run unified Cisco WAN licensing (${uni.sku || "LIC-CSWAN"}-E / -A)`, true);
  }
  return r(m, null, null, "No co-term license documented for this model");
}
