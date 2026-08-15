export type Attendance = "joining" | "not-joining";

export type Rsvp = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type RsvpDatabase = {
  rsvps: Rsvp[];
};
