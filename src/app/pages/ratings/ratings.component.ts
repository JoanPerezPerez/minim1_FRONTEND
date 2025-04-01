import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RatingsService } from '../../services/ratings.service';
import { Rating } from '../../models/rating.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
  imports:[
    ReactiveFormsModule,
    CommonModule
  ]
})
export class RatingsComponent implements OnInit {
  ratings: Rating[] = [];
  Math = Math;
  totalRatings: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  ratingForm: FormGroup;
  editingRating: Rating | null = null;

  constructor(private ratingsService: RatingsService, private fb: FormBuilder) {
    this.ratingForm = this.fb.group({
      calendar: ['', Validators.required],
      score: [null, [Validators.required, Validators.pattern('0|1')]]
    });
  }

  ngOnInit(): void {
    this.fetchRatings();
  }

  fetchRatings(): void {
    this.ratingsService.getRatings(this.currentPage, this.itemsPerPage).subscribe(response => {
      this.ratings = response.ratings;
      this.totalRatings = response.total;
    });
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.fetchRatings();
  }
  submitRating(): void {
    if (this.ratingForm.invalid) return;

    const ratingData: Partial<Rating> = this.ratingForm.value;

    if (this.editingRating) {
      this.ratingsService.updateRating(this.editingRating._id!, ratingData).subscribe({
        next: () => {
          this.fetchRatings();
          this.resetForm();
        },
        error: (error) => console.error('Error updating rating:', error)
      });
    } else {
      this.ratingsService.createRating(ratingData).subscribe({
        next: () => {
          this.fetchRatings();
          this.resetForm();
        },
        error: (error) => console.error('Error creating rating:', error)
      });
    }
  }

  editRating(rating: Rating): void {
    this.editingRating = rating;
    this.ratingForm.patchValue(rating);
  }

  deleteRating(id: string): void {
    this.ratingsService.deleteRating(id).subscribe({
      next: () => this.fetchRatings(),
      error: (error) => console.error('Error deleting rating:', error)
    });
  }

  resetForm(): void {
    this.ratingForm.reset();
    this.editingRating = null;
  }
}

