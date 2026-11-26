import React from 'react';
import OfficePage from '../../components/OfficePage';
import OfficeScheduleCard from '../../components/OfficeScheduleCard';

export default function OfficeSchedule() {
  return (
    <OfficePage title="ساعات العمل والسعة اليومية">
      <OfficeScheduleCard />
    </OfficePage>
  );
}
