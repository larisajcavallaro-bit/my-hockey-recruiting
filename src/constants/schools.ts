export const GENDER_OPTIONS = ["Male", "Female", "Co-ed"] as const;
export const AGE_BRACKETS = ["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U20"] as const;

/** Leagues with girls teams – shown in the Girls section on profiles */
export const GIRLS_LEAGUES = [
  "E9 Girls",
  "NEPSAC Girls Hockey",
  "NEGHL",
  "Independent",
  "NEPSAC / Independent",
  "Valley League",
  "NHAHA",
] as const;

/** Leagues typically boys-only – shown in the Boys section on profiles */
export const BOYS_LEAGUES = [
  "E9 Boys",
  "NEPSAC Boys Hockey",
  "Junior Prep",
  "EHL",
  "EHLP",
  "NAHL",
  "NCDC",
  "USPHL Elite",
  "USPHL Premier",
  "EHF",
  "PHL",
] as const;
