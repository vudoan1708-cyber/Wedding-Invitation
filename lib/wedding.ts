export const wedding = {
  groom: {
    firstName: "Vu",
    displayName: "Vu Doan",
    fullName: "Vu Trong Doan",
    initial: "V",
  },
  bride: {
    firstName: "Nhi",
    displayName: "Nhi Dinh",
    fullName: "Nhi Thi Khanh Dinh",
    initial: "N",
  },
  date: {
    iso: "2026-12-20",
    weekday: "Sunday",
    dayNumeral: "20",
    monthLong: "December",
    year: "2026",
    yearWords: "Two Thousand Twenty-Six",
    long: "Sunday, the Twentieth of December, Two Thousand Twenty-Six",
  },
  location: {
    city: "Ho Chi Minh City",
    country: "Vietnam",
    line: "Ho Chi Minh City, Vietnam",
  },
  dressCode: {
    label: "Dress Code",
    value: "Smart",
    note: "Smart attire — we would love to see you at your most polished.",
  },
  rsvpBy: "Kindly respond by the first of November, 2026",
} as const;

export const coupleShort = `${wedding.groom.firstName} & ${wedding.bride.firstName}`;
export const coupleDisplay = `${wedding.groom.displayName} & ${wedding.bride.displayName}`;
