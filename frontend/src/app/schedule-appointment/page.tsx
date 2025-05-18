'use client';
import React from 'react';
import ScheduleAppointmentTemplate from '@/components/templates/ScheduleAppointmentTemplate';
import { withAuth } from '@/components/hoc/withAuth';

function ScheduleAppointmentPage() {
    return <ScheduleAppointmentTemplate />;
}

export default withAuth(ScheduleAppointmentPage); 