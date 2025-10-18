import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from '@/services/activities';
import type {
  CreateActivityRequest,
  CreateActivityResponse,
  DeleteActivityResponse,
  ErrorResponse,
  GetActivitiesFilters,
  GetActivitiesResponse,
  UpdateActivityRequest,
  UpdateActivityResponse,
} from '@/types/api';

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
      if (priority) filters.priority = Number(priority) as GetActivitiesFilters['priority'];
    }

    if (searchParams.has('energy')) {
      const energy = searchParams.get('energy');
      if (energy) filters.energy = Number(energy) as GetActivitiesFilters['energy'];
    }

    const activities = await getActivities(filters);
    const response: GetActivitiesResponse = { success: true, data: activities };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching activities:', error);
    const errorResponse: ErrorResponse = { error: 'Failed to fetch activities' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/activities - Create new activity
export async function POST(request: NextRequest) {
  try {
    const body: CreateActivityRequest = await request.json();

    if (!body.title?.trim()) {
      const errorResponse: ErrorResponse = { error: 'Title is required' };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const activityId = await createActivity(body);
    const response: CreateActivityResponse = { success: true, id: activityId };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    const errorResponse: ErrorResponse = { error: 'Failed to create activity' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/activities?id=X - Update activity
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      const errorResponse: ErrorResponse = { error: 'Activity ID is required' };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const body: UpdateActivityRequest = await request.json();
    await updateActivity(Number(id), body);

    const response: UpdateActivityResponse = { success: true };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating activity:', error);
    const errorResponse: ErrorResponse = { error: 'Failed to update activity' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/activities?id=X - Delete activity
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      const errorResponse: ErrorResponse = { error: 'Activity ID is required' };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    await deleteActivity(Number(id));
    const response: DeleteActivityResponse = { success: true };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting activity:', error);
    const errorResponse: ErrorResponse = { error: 'Failed to delete activity' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
