// client/src/pages/Referral/ReferralRequest.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReferralRequestForm from '../../components/candidate/ReferralRequestForm';

const ReferralRequest = () => {
  const { referrerId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <ReferralRequestForm
        referrerId={referrerId}
        onSuccess={() => {
          navigate('/dashboard/candidate');
        }}
      />
    </div>
  );
};

export default ReferralRequest;
