
import { Injectable } from "@angular/core";
import { CookieService } from "./services/cookie/cookie.service";
import { StudentService } from "./services/Services";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationProcedure {
  constructor(private studentService: StudentService,
    private cookieService: CookieService) {
  }

  public authenticateWithCookieIfHasLogin() {
    if (this.studentService.hasLogin()) {
      this.authenticateWithCookie();
    }
  }

  public authenticateWithCookie() {
    const token = this.cookieService.get(StudentService.KEY_TOKEN);
    if (token) {
      this.studentService.auth(token).toPromise()
        .then(s => { })
        .catch(err => {
          console.error(err);
        });
    }
  }
}