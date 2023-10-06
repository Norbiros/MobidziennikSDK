export interface Book {
    id: number;
    title: string;
    author: string;
    type: string;
    publicationSignature: string;
    publicationPlace: string;
    publisher: string;
    publicationDate: string;
    copiesNumber: number;
    availableCopiesNumber: number;
    reservationAvailable: boolean;
}
