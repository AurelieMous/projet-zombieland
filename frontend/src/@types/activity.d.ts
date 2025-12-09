import type {Category} from "./categorie";
import type {Attraction} from "./attraction";


export interface Activity {
    id: number;
    name: string;
    description: string;
    category_id: number;
    attraction_id?: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    attraction?: Attraction | null;
}
