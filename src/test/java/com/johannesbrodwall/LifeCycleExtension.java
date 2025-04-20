package com.johannesbrodwall;

import org.eclipse.jetty.util.component.LifeCycle;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Modifier;
import java.util.List;

/**
 * Calls {@link LifeCycle#start} and {@link LifeCycle#stop} before and after
 * each test method on all instance fields that implement {@link LifeCycle}.
 * Throws exception if there are no fields on the class that implement {@link LifeCycle}.
 *
* <p>TODO: In the future, I plan to support static fields, where these will be invoked
 * with BeforeAll and AfterAll.
 */
@ExtendWith(LifeCycleExtension.Implementation.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface LifeCycleExtension {
    class Implementation implements BeforeEachCallback, AfterEachCallback {
        @Override
        public void afterEach(ExtensionContext context) throws Exception {
            if (context.getTestInstance().isPresent()) {
                var instance = context.getTestInstance().get();
                for (var field : List.of(instance.getClass().getDeclaredFields()).reversed()) {
                    field.setAccessible(true);
                    if (!Modifier.isStatic(field.getModifiers())) LifeCycle.stop(field.get(instance));
                }
            }
        }

        @Override
        public void beforeEach(ExtensionContext context) throws Exception {
            if (context.getTestInstance().isPresent()) {
                var found = false;
                var instance = context.getTestInstance().get();
                for (var field : instance.getClass().getDeclaredFields()) {
                    field.setAccessible(true);
                    var o = field.get(instance);
                    if (o instanceof LifeCycle || LifeCycle.class.isAssignableFrom(field.getType())) {
                        found = true;
                    }
                    if (!Modifier.isStatic(field.getModifiers())) LifeCycle.start(o);
                }
                if (!found) {
                    throw new IllegalArgumentException("No LifeCycle fields in " + instance.getClass());
                }
            }
        }
    }
}
