// client/src/pages/Referral/ReferralRequest.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ReferralRequestForm from '../../components/candidate/ReferralRequestForm';

const ReferralRequest = () => {
  const { referrerId } = useParams();

  return (
    <div className="max-w-2xl mx-auto">
      <ReferralRequestForm
        referrerId={referrerId}
        onSuccess={() => {
          // Handle success - redirect to dashboard
          window.location.href = '/dashboard/candidate';
        }}
      />
    </div>
  );
};

export default ReferralRequest;
