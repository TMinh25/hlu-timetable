import * as React from "react";
import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";

const pluginDependencies = [
  // { name: "DayView", optional: true },
  // { name: "WeekView", optional: true },
  // { name: "MonthView", optional: true },
  // { name: "AllDayPanel", optional: true }
];

export const TaskLimiter = () => {
  return (
    <Plugin name="TaskLimiter" pluginDependencies={pluginDependencies}>
      <Template name="cell">
        {(params) => {
          return (
            <TemplateConnector>
              {({ timeTableAppointments }) => {
                const {
                  startDate,
                  endDate,
                  onDoubleClick,
                  groupingInfo, // Should be taken into account if grouping is used
                } = params;
                let handleDoubleClick = onDoubleClick
                  ? () => {
                      const isSpaceAvailable = timeTableAppointments.reduce(
                        (isAvailable, groupedAppointments) => {
                          return groupedAppointments.reduce(
                            (acc, appointment) => {
                              const { start, end } = appointment;
                              if (
                                start.isBefore(endDate) &&
                                end.isAfter(startDate)
                              ) {
                                return false;
                              }
                              return acc;
                            },
                            isAvailable
                          );
                        },
                        true
                      );
                      if (!isSpaceAvailable) {
                        alert("Impossible to create another appointment here");
                      }
                      isSpaceAvailable && onDoubleClick();
                    }
                  : undefined;
                // console.log(params);
                return (
                  <TemplatePlaceholder
                    params={{
                      ...params,
                      onDoubleClick: handleDoubleClick,
                    }}
                  />
                );
              }}
            </TemplateConnector>
          );
        }}
      </Template>
    </Plugin>
  );
};
