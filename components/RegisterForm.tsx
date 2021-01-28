import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { Entry } from 'contentful';
import React from 'react';
import { useState } from 'react';
import { RegistrationFormFields } from '../lib/contentful';
import Splitter from './Splitter';

export const RegisterForm: React.FC<Entry<RegistrationFormFields>> = ({
  fields,
}) => {
  const { heading } = fields || {};
  return (
    <>
      <div className="py-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full justify-center items-start text-center md:text-left">
            <h1 className="my-4 text-5xl font-bold leading-tight">{heading}</h1>
          </div>
        </div>
      </div>
      <Splitter />
    </>
  );
};
