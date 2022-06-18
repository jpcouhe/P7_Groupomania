import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "src/models/Category.model";
import { BehaviorSubject, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class CategoriesService {
    categories$ = new BehaviorSubject<any>([]);
    constructor(private http: HttpClient) {}

    getAllCategories() {
        this.http
            .get<[Category]>("http://localhost:3003/api/categories")
            .pipe(
                tap((categorie) => {
                    console.log(categorie);

                    this.categories$.next(categorie);
                })
            )
            .subscribe();
    }
}
