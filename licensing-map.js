// Hardware model -> subscription license class, per the Meraki documentation:
//   Subscription - MX, MS, MR, MV, MT Licensing, Unified Licensing Wi-Fi 7 APs
//   (plus the Z Licensing page the MX page links to).
// Models are normalised before lookup: upper-cased, with "-HW", "-HW-NA/WW/JP" and a
// trailing Catalyst "-M" removed. Edit this file if Meraki adds models.

const LICENSE_CLASSES = [
  // ---- MX / vMX ----
  { cls: "MX Small", sku: "LIC-MX-S", family: "MX", models: ["MX50","MX60","MX60W","MX64","MX64W","MX65","MX65W","MX67","MX67C","MX67W","MX68","MX68W","MX68CW","VMX-S"] },
  { cls: "MX Medium", sku: "LIC-MX-M", family: "MX", models: ["MX70","MX75","MX80","MX84","MX85","VMX-M"] },
  { cls: "MX Large", sku: "LIC-MX-L", family: "MX", models: ["MX90","MX95","MX100","MX105","MX400","VMX100","VMX-L"] },
  { cls: "MX X-Large", sku: "LIC-MX-XL", family: "MX", models: ["MX250","MX450","MX600","VMX-XL"] },
  // ---- Cisco Secure Router (MX-managed) ----
  { cls: "C8K-G2-MX Small", sku: "LIC-CSR-S", family: "MX", models: ["C8111-G2-MX","C8111-C-G2-MX","C8121-G2-MX","C8121-W-G2-MX","C8121-CW-G2-MX"] },
  { cls: "C8K-G2-MX Large", sku: "LIC-CSR-L", family: "MX", models: ["C8355-G2-MX"] },
  { cls: "C8K-G2-MX X-Large", sku: "LIC-CSR-XL", family: "MX", models: ["C8455-G2-MX"] },
  // ---- Z teleworker ----
  { cls: "Z", sku: "LIC-Z", family: "Z", models: ["Z1","Z3","Z3C","Z4","Z4C"] },
  // ---- MS ----
  { cls: "MS100 Small", sku: "LIC-MS-100-S", family: "MS", models: ["MS120-8","MS120-8LP","MS120-8FP","MS130-8","MS130-8P","MS130-8X","MS130R-8P","MS130-12X","MS220-8","MS220-8P"] },
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
  // ---- MR (Wi-Fi 6/6E and earlier) ----
  { cls: "Wireless (MR)", sku: "LIC-MR", family: "MR", models: ["MR11","MR12","MR14","MR16","MR18","MR20","MR24","MR26","MR28","MR30H","MR32","MR33","MR34","MR36","MR36H","MR42","MR42E","MR44","MR45","MR46","MR46E","MR52","MR53","MR53E","MR55","MR56","MR57","MR58","MR58-CAR","MR58-PRO","MR62","MR66","MR70","MR72","MR74","MR76","MR78","MR84","MR86","CW9162I","CW9163E","CW9164I","CW9166I","CW9166D1"] },
  // ---- Wi-Fi 7 (Unified licensing) ----
  { cls: "Wi-Fi 7 (CW)", sku: "LIC-CW", family: "CW", models: ["CW9171I","CW9172I","CW9172H","CW9174I","CW9174E","CW9176D1","CW9176I","CW9178I","CW9179F"] },
  // ---- MV cameras (Subscription - MV Licensing) ----
  { cls: "Camera", sku: "LIC-MV", family: "MV", models: ["MV12N","MV12W","MV12WE","MV13","MV13M","MV2","MV21","MV22","MV22X","MV23M","MV23X","MV32","MV33","MV33M","MV52","MV63","MV63M","MV63X","MV71","MV72","MV72X","MV73M","MV73X","MV93","MV93M","MV93X"] },
  { cls: "Camera (multi-imager)", sku: "LIC-MV-MULTCAM", family: "MV", models: ["MV84X","MV44X"] },
  // ---- MT sensors (Subscription - MT Licensing) ----
  { cls: "Sensor", sku: "LIC-MT", family: "MT", models: ["MT10","MT11","MT12","MT14","MT15","MT20","MT30","MT40"] },
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
  if (/^C9800/.test(m)) return inf("Catalyst WLC", "—", "WLC", "Catalyst 9800 WLC — outside the referenced docs");
  if (/^C91\d\d/.test(m)) return inf("Catalyst AP (via WLC)", "—", "MR", "Catalyst AP behind a 9800 WLC — outside the referenced docs");
  if (/^MG/.test(m)) return inf("Cellular (MG)", "LIC-MG", "MG", "MG — outside the referenced MX/MS/MR/Wi-Fi 7 docs");
  if (/^MV/.test(m)) return inf("Camera (MV)", "LIC-MV", "MV", "MV — outside the referenced docs");
  if (/^MT/.test(m)) return inf("Sensor (MT)", "LIC-MT", "MT", "MT — outside the referenced docs");
  return { cls: "Unmapped", sku: "—", family: "Other", inferred: true, note: "No matching license class in the referenced docs" };
}
