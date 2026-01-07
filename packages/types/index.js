"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.ApplicationStatus = exports.ProjectStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["STUDENT"] = "STUDENT";
    UserRole["CLIENT"] = "CLIENT";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PENDING"] = "PENDING";
    ProjectStatus["OPEN"] = "OPEN";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["CANCELLED"] = "CANCELLED";
})(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["APPLIED"] = "APPLIED";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["ACCEPTED"] = "ACCEPTED";
})(ApplicationStatus = exports.ApplicationStatus || (exports.ApplicationStatus = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "TODO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["REVIEW_REQUIRED"] = "REVIEW_REQUIRED";
    TaskStatus["COMPLETED"] = "COMPLETED";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
