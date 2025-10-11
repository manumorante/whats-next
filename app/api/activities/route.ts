import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createActivity, deleteActivity, getActivities, updateActivity } from '@/lib/activities';
import type {
  CreateActivityRequest,
  GetActivitiesFilters,
  UpdateActivityRequest,
} from '@/lib/types';

// GET /api/activities - Get all activities with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: GetActivitiesFilters = {};

    if (searchParams.has('category_id')) {
      filters.category_id = Number(searchParams.get('category_id'));
    }

    if (searchParams.has('priority')) {
      const priority = searchParams.get('priority');
      if (priority) filters.priority = priority as GetActivitiesFilters['priority'];
    }

    if (searchParams.has('energy_level')) {
      const energyLevel = searchParams.get('energy_level');
      if (energyLevel) filters.energy_level = energyLevel as GetActivitiesFilters['energy_level'];
    }

    if (searchParams.has('is_completed')) {
      filters.is_completed = searchParams.get('is_completed') === 'true';
    }

    if (searchParams.has('is_recurring')) {
      filters.is_recurring = searchParams.get('is_recurring') === 'true';
    }

    if (searchParams.has('location')) {
      const location = searchParams.get('location');
      if (location) filters.location = location;
    }

    const activities = await getActivities(filters);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

// POST /api/activities - Create new activity
export async function POST(request: NextRequest) {
  try {
    const body: CreateActivityRequest = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const activityId = await createActivity(body);

    return NextResponse.json({ success: true, id: activityId }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

// PUT /api/activities?id=X - Update activity
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const body: UpdateActivityRequest = await request.json();
    await updateActivity(Number(id), body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

// DELETE /api/activities?id=X - Delete activity
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    await deleteActivity(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
