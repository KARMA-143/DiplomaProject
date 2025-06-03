import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {UserStore} from "./stores/UserStore";
import {BrowserRouter} from "react-router-dom";
import {CourseStore} from "./stores/CourseStore";
import {CoverStore} from "./stores/CoverStore";
import {CourseContentStore} from "./stores/CourseContentStore";
import {SnackbarStore} from "./stores/SnackbarStore";
import {InvitationStore} from "./stores/InvitationStore";
import {TaskStore} from "./stores/TaskStore";
import {TestStore} from "./stores/TestStore";
import {UserAssignments} from "./stores/UserAssignments";
export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
      User: new UserStore(),
      Courses: new CourseStore(),
      Covers: new CoverStore(),
      CourseContent: new CourseContentStore(),
      SnackbarStore: new SnackbarStore(),
      Invitations: new InvitationStore(),
      Task: new TaskStore(),
      Test: new TestStore(),
      UserAssignments: new UserAssignments()
  }}>
      <BrowserRouter>
          <App/>
      </BrowserRouter>
  </Context.Provider>
);

reportWebVitals();