import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Beer } from '../models/beer';
import { Style } from '../models/style';
import { Country } from '../models/country';


@Injectable({
  providedIn: 'root'
})
export class BeerService {
  uri = 'http://localhost:4000/beers';

  constructor(private http: HttpClient) { }

  // initial data requests
  getBeers(page: number): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${this.uri}?page=${page}`)
    .pipe(
      retry(1),
      catchError(this.handleError));
  }

  getStyles(): Observable<Style[]> {
    const url = 'http://localhost:4000/styles';
    return this.http.get<Style[]>(url)
    .pipe(
      retry(1),
      catchError(this.handleError));
  }

  getCountries(): Observable<Country[]> {
    const url = 'http://localhost:4000/countries';
    return this.http.get<Country[]>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // queries
  searchBeers(term: string): Observable<Beer[]> {
    if (!term.trim()) {
      // if not search term, return empty response.
      return new Observable<Beer[]>();
    }

    return this.http.get<Beer[]>(`${this.uri}?name=${term}`).pipe(
      retry(1),
      catchError(this.handleError)
  );
  }

  getBeersByCountry(countryCode: string, page: number): Observable<Beer[]> {
    const url = `http://localhost:4000/beers?countryCode=${countryCode}&page=${page}`;
    return this.http.get<Beer[]>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
  );
  }

  getBeersByStyle(id: number, page: number): Observable<Beer[]> {
    const url = `http://localhost:4000/beers?styleId=${id}&page=${page}`;
    return this.http.get<Beer[]>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
  );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
}
}
