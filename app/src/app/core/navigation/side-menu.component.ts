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
    const gatewayUrl = `${window.location.protocol}//${window.location.hostname}:8084`;
    this.apiLinks = [
      { label: 'API Gateway', icon: 'hub', href: `${gatewayUrl}/` },
      { label: 'Swagger NestJS', icon: 'description', href: `${gatewayUrl}/swagger/nestjs` },
      { label: 'Swagger .NET', icon: 'code', href: `${gatewayUrl}/swagger/dotnet` },
      { label: 'API Persons', icon: 'list', href: `${gatewayUrl}/api/persons` },
      { label: 'Health Check', icon: 'monitor_heart', href: `${gatewayUrl}/health` },
    ];
  }

  onNavigate(): void {
    this.navigate.emit();
  }
}
