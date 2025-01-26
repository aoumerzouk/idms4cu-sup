import React from 'react';
import { FolderTree } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { creditUnionConfig } from '../config/creditUnion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FolderTree className={`w-12 h-12 text-${creditUnionConfig.branding.primaryColor}-500`} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {creditUnionConfig.name}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the document management system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
