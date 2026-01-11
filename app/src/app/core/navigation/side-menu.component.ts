import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  path?: string;
  href?: string;
}

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit {
  @Output() readonly navigate = new EventEmitter<void>();

  readonly mainLinks: NavItem[] = [
    { label: 'Pessoas', icon: 'group', path: '/persons' },
  ];

  apiLinks: NavItem[] = [];

  ngOnInit(): void {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
    this.apiLinks = [
      { label: 'API Docs', icon: 'description', href: `${baseUrl}/api` },
      { label: 'API JSON', icon: 'data_object', href: `${baseUrl}/openapi.json` },
      { label: 'API Persons', icon: 'list', href: `${baseUrl}/persons` },
      { label: 'API Root', icon: 'home', href: `${baseUrl}/` },
      { label: 'API JSON (Nest)', icon: 'code', href: `${baseUrl}/api-json` },
    ];
  }

  onNavigate(): void {
    this.navigate.emit();
  }
}
