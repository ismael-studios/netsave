/*
 * @file: Regex.js
 * @description: Regex used for validation in application.
 * @date: 29.05.2020
 * @author: Allu Lavaraju
 * */
/* eslint-disable */
'use strict'
export const Validations = {
  email: function (val: string) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      val
    )
  },
}

export const isValidEmail = (email: string) => Validations.email(email)
